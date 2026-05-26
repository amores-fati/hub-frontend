'use client';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import { AxiosError } from 'axios';
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toast } from 'react-toastify';

import { Loading } from '@/components/base';
import {
    ApiErrorDto,
    ResumeSkill,
    StudentResume,
} from '@/dtos/StudentResumeDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import {
    useAddStudentResumeSkill,
    useRemoveStudentResumeSkill,
    useUpdateStudentResume,
    useUploadStudentResumePhoto,
} from '@/services/api/students/resume/mutations';
import { useGetStudentResume } from '@/services/api/students/resume/queries';
import { useUpdateStudentProfile } from '@/services/api/students/mutations';
import { useGetStudentProfile } from '@/services/api/students/queries';
import { UserRole } from '@/dtos/UserDto';
import './index.scss';
import { StudentProfile } from '@/dtos/StudentProfileDto';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SKILL_DOT_COLORS = [
    '#5bd8ec',
    '#e30046',
    '#ff4d00',
    '#00a6c7',
    '#6d48bf',
    '#7fcbd2',
    '#526dbc',
];

const toNullableString = (value: string) => {
    const trimmedValue = value.trim();
    return trimmedValue.length ? trimmedValue : null;
};

const normalizeSkillName = (value: string) =>
    value.trim().toLocaleLowerCase('pt-BR');

const formatStudentName = (email?: string) => {
    if (!email) return 'Aluno';

    const localPart = email.split('@')[0];
    const words = localPart
        .split(/[._-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    return words.length ? words.join(' ') : 'Aluno';
};

const formatProfileText = (value?: string | null) => {
    if (!value) return '';

    return value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getInitials = (name: string) => {
    const words = name.split(' ').filter(Boolean);
    const initials = words.slice(0, 2).map((word) => word.charAt(0));

    return initials.join('').toUpperCase() || 'A';
};

const getPhotoUrl = (photoUrl?: string | null) => {
    if (!photoUrl) return null;

    if (
        photoUrl.startsWith('http://') ||
        photoUrl.startsWith('https://') ||
        photoUrl.startsWith('blob:') ||
        photoUrl.startsWith('data:')
    ) {
        return photoUrl;
    }

    return `${API_BASE_URL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
};

const isValidAbsoluteUrl = (value: string) => {
    if (!value.trim()) return true;

    try {
        const parsedUrl = new URL(value.trim());
        return (
            parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
        );
    } catch {
        return false;
    }
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
    const apiError = error as
        | AxiosError<ApiErrorDto>
        | (Error & { response?: { data?: ApiErrorDto } });
    const message = apiError.response?.data?.message;

    if (Array.isArray(message) && message.length) return message[0];
    if (typeof message === 'string' && message.length) return message;
    if (error instanceof Error && error.message) return error.message;

    return fallback;
};

export default function Index() {
    const { user } = useAuth();
    const studentId = user?.sub || user?.userId;
    const {
        data: resume,
        isError: isErrorResume,
        isLoading: isLoadingResume,
    } = useGetStudentResume();
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
    } = useGetStudentProfile();

    if (!resume || !profile) return <></>;

    return (
        <StudentResumePage
            studentId={studentId}
            profile={profile}
            resume={resume}
            isLoading={isLoadingProfile || isLoadingResume}
            isError={isErrorProfile || isErrorResume}
        />
    );
}

export function StudentResumePage({
    profile,
    resume,
    isError,
    isLoading,
    studentId,
}: {
    profile: StudentProfile;
    resume: StudentResume;
    isError: boolean;
    isLoading: boolean;
    studentId?: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;
    const canEdit = !isAdmin;

    const updateResume = useUpdateStudentResume();
    const updateStudentProfile = useUpdateStudentProfile();
    const uploadPhoto = useUploadStudentResumePhoto();
    const addSkill = useAddStudentResumeSkill();
    const removeSkill = useRemoveStudentResumeSkill();

    const [profileName, setProfileName] = useState('');
    const [disabilityType, setDisabilityType] = useState('');
    const [about, setAbout] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [isEditingResume, setIsEditingResume] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState<ResumeSkill[]>([]);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(
        null,
    );
    const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<
        string | null
    >(null);

    const displayName = useMemo(
        () =>
            profileName.trim() ||
            profile?.socialName ||
            formatStudentName(user?.email),
        [profileName, profile?.socialName, user?.email],
    );
    const profileSubtitle = useMemo(
        () =>
            profile?.activityArea
                ? formatProfileText(profile.activityArea)
                : 'Currículo do aluno',
        [profile?.activityArea],
    );
    const initials = useMemo(() => getInitials(displayName), [displayName]);
    const persistedPhotoUrl = useMemo(
        () => getPhotoUrl(resume?.photoUrl),
        [resume?.photoUrl],
    );

    const currentPhotoUrl = selectedPhotoPreview;
    const isSaving =
        updateResume.isPending ||
        updateStudentProfile.isPending ||
        uploadPhoto.isPending;
    const isManagingSkill = addSkill.isPending || removeSkill.isPending;

    useEffect(() => {
        if (isEditingResume) return;

        setAbout(resume?.about ?? '');
        setLinkedinUrl(resume?.linkedinUrl ?? '');
        setGithubUrl(resume?.githubUrl ?? '');
        setSkills(resume?.skills ?? []);
    }, [isEditingResume, resume]);

    useEffect(() => {
        if (isEditingResume) return;

        setProfileName(profile?.socialName || formatStudentName(user?.email));
        setDisabilityType(profile?.disability?.type ?? '');
    }, [isEditingResume, profile, user?.email]);

    const resetEditableFields = () => {
        setProfileName(profile?.socialName || formatStudentName(user?.email));
        setDisabilityType(profile?.disability?.type ?? '');
        setAbout(resume?.about ?? '');
        setLinkedinUrl(resume?.linkedinUrl ?? '');
        setGithubUrl(resume?.githubUrl ?? '');
        setSelectedPhotoFile(null);
        setSelectedPhotoPreview((previousPreview) => {
            if (previousPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(previousPreview);
            }

            return null;
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancelEdit = () => {
        resetEditableFields();
        setIsEditingResume(false);
    };

    useEffect(() => {
        return () => {
            if (selectedPhotoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(selectedPhotoPreview);
            }
        };
    }, [selectedPhotoPreview]);

    const handlePhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isEditingResume) return;

        const file = event.target.files?.[0];

        if (!file) return;

        if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
            toast.error('Use uma foto em JPG, PNG ou WebP.');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            toast.error('A foto deve ter no máximo 5 MB.');
            event.target.value = '';
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setSelectedPhotoPreview((previousPreview) => {
            if (previousPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(previousPreview);
            }

            return previewUrl;
        });
        setSelectedPhotoFile(file);
    };

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidAbsoluteUrl(linkedinUrl)) {
            toast.error('Informe uma URL completa para o LinkedIn.');
            return;
        }

        if (!isValidAbsoluteUrl(githubUrl)) {
            toast.error('Informe uma URL completa para o GitHub.');
            return;
        }

        if (profileName.trim().length > 100) {
            toast.error('O nome deve ter no máximo 100 caracteres.');
            return;
        }

        if (disabilityType.trim().length > 50) {
            toast.error(
                'O tipo de deficiência deve ter no máximo 50 caracteres.',
            );
            return;
        }

        try {
            if (studentId) {
                await updateStudentProfile.mutateAsync({
                    id: studentId,
                    socialName: toNullableString(profileName),
                    disability: {
                        hasDisability: !!disabilityType.trim(),
                        type: toNullableString(disabilityType),
                    },
                });
            }

            await updateResume.mutateAsync({
                about: toNullableString(about),
                linkedinUrl: toNullableString(linkedinUrl),
                githubUrl: toNullableString(githubUrl),
            });

            if (selectedPhotoFile) {
                await uploadPhoto.mutateAsync(selectedPhotoFile);
                setSelectedPhotoFile(null);
                setSelectedPhotoPreview(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }

            setIsEditingResume(false);
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    'Não foi possível salvar o currículo.',
                ),
            );
        }
    };

    const handleAddSkill = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const skillName = skillInput.trim();

        if (!skillName) {
            toast.error('Digite uma habilidade para adicionar.');
            return;
        }

        if (skillName.length > 100) {
            toast.error('A habilidade deve ter no máximo 100 caracteres.');
            return;
        }

        const alreadyExists = skills.some(
            (skill) =>
                normalizeSkillName(skill.skillName) ===
                normalizeSkillName(skillName),
        );

        if (alreadyExists) {
            toast.error('Essa habilidade já está na lista.');
            return;
        }

        try {
            const createdSkill = await addSkill.mutateAsync({ skillName });
            setSkills((currentSkills) => [...currentSkills, createdSkill]);
            setSkillInput('');
            toast.success('Habilidade adicionada.');
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    'Não foi possível adicionar a habilidade.',
                ),
            );
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        const previousSkills = skills;

        setSkills((currentSkills) =>
            currentSkills.filter((skill) => skill.id !== skillId),
        );

        try {
            await removeSkill.mutateAsync(skillId);
            toast.success('Habilidade removida.');
        } catch (error) {
            setSkills(previousSkills);
            toast.error(
                getApiErrorMessage(
                    error,
                    'Não foi possível remover a habilidade.',
                ),
            );
        }
    };

    if (isLoading) {
        return (
            <section className='student-resume-page student-resume-page--centered'>
                <Loading className='student-resume-page__loading' />
            </section>
        );
    }

    if (isError) {
        return (
            <section className='student-resume-page student-resume-page--centered'>
                <div className='student-resume-feedback'>
                    <h1>Currículo indisponível</h1>
                    <p>
                        Não foi possível carregar os dados do currículo agora.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className='student-resume-page'>
            <div className='student-resume-page__grid'>
                <form
                    className='student-resume-card'
                    onSubmit={(event) => void handleSave(event)}
                >
                    <div className='student-resume-card__cover' />

                    <div className='student-resume-card__profile'>
                        <div className='student-resume-card__photo'>
                            <div
                                className='student-resume-card__avatar'
                                style={
                                    currentPhotoUrl
                                        ? {
                                              backgroundImage: `url("${currentPhotoUrl}")`,
                                          }
                                        : undefined
                                }
                                aria-label='Foto do aluno'
                            >
                                {!currentPhotoUrl && <span>{initials}</span>}
                            </div>

                            {isEditingResume && (
                                <div className='student-resume-card__photo-actions'>
                                    <input
                                        ref={fileInputRef}
                                        className='student-resume-card__file-input'
                                        id='student-resume-photo'
                                        type='file'
                                        accept='image/jpeg,image/png,image/webp'
                                        onChange={handlePhotoSelection}
                                    />
                                    <button
                                        className='student-resume-button student-resume-button--secondary'
                                        type='button'
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <UploadIcon fontSize='small' />
                                        Alterar foto
                                    </button>
                                    {selectedPhotoFile && (
                                        <span className='student-resume-card__photo-status'>
                                            Prévia pronta para salvar
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='student-resume-card__identity'>
                            <h1>{displayName}</h1>
                            <div className='student-resume-card__headline'>
                                <p>{profileSubtitle}</p>
                                {disabilityType.trim() && (
                                    <span>
                                        {formatProfileText(disabilityType)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className='student-resume-card__actions'>
                            {canEdit && isEditingResume ? (
                                <>
                                    <button
                                        className='student-resume-button student-resume-button--ghost'
                                        type='button'
                                        disabled={isSaving}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className='student-resume-button student-resume-button--primary'
                                        type='submit'
                                        disabled={isSaving}
                                    >
                                        <SaveIcon fontSize='small' />
                                        {isSaving
                                            ? 'Salvando...'
                                            : 'Salvar alterações'}
                                    </button>
                                </>
                            ) : canEdit ? (
                                <button
                                    className='student-resume-button student-resume-button--primary'
                                    type='button'
                                    onClick={() => setIsEditingResume(true)}
                                >
                                    <EditIcon fontSize='small' />
                                    Editar
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className='student-resume-form'>
                        <div className='student-resume-form__profile'>
                            <label className='student-resume-field'>
                                <span>Nome social</span>
                                <input
                                    value={profileName}
                                    disabled={!isEditingResume}
                                    onChange={(event) =>
                                        setProfileName(event.target.value)
                                    }
                                    placeholder='Informe seu nome social'
                                    maxLength={100}
                                />
                            </label>
                        </div>

                        <div className='student-resume-form__links'>
                            <label className='student-resume-field'>
                                <span>LinkedIn</span>
                                <div className='student-resume-field__input'>
                                    <input
                                        value={linkedinUrl}
                                        disabled={!isEditingResume}
                                        onChange={(event) =>
                                            setLinkedinUrl(event.target.value)
                                        }
                                        placeholder='https://www.linkedin.com/in/seu-perfil'
                                        type='url'
                                    />
                                    <LinkedInIcon fontSize='small' />
                                </div>
                            </label>

                            <label className='student-resume-field'>
                                <span>GitHub</span>
                                <div className='student-resume-field__input'>
                                    <input
                                        value={githubUrl}
                                        disabled={!isEditingResume}
                                        onChange={(event) =>
                                            setGithubUrl(event.target.value)
                                        }
                                        placeholder='https://github.com/seu-usuario'
                                        type='url'
                                    />
                                    <GitHubIcon fontSize='small' />
                                </div>
                            </label>
                        </div>

                        <label className='student-resume-field student-resume-field--textarea'>
                            <span>Sobre mim</span>
                            <textarea
                                value={about}
                                disabled={!isEditingResume}
                                onChange={(event) =>
                                    setAbout(event.target.value)
                                }
                                rows={9}
                                placeholder='Conte brevemente sua trajetória, interesses e objetivos profissionais.'
                            />
                        </label>
                    </div>
                </form>

                <aside className='student-resume-sidebar'>
                    <div className='student-resume-panel'>
                        <div className='student-resume-panel__title'>
                            <CodeIcon />
                            <h2>Habilidades</h2>
                        </div>

                        <div className='student-resume-skills'>
                            {skills.length ? (
                                skills.map((skill, index) => (
                                    <span
                                        className='student-resume-skill'
                                        key={skill.id}
                                    >
                                        <span
                                            className='student-resume-skill__dot'
                                            style={{
                                                backgroundColor:
                                                    SKILL_DOT_COLORS[
                                                        index %
                                                            SKILL_DOT_COLORS.length
                                                    ],
                                            }}
                                        />
                                        {skill.skillName}
                                        {canEdit && (
                                            <button
                                                type='button'
                                                aria-label={`Remover ${skill.skillName}`}
                                                disabled={isManagingSkill}
                                                onClick={() =>
                                                    void handleRemoveSkill(
                                                        skill.id,
                                                    )
                                                }
                                            >
                                                <CloseIcon fontSize='small' />
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <p className='student-resume-skills__empty'>
                                    Nenhuma habilidade cadastrada.
                                </p>
                            )}
                        </div>

                        {canEdit && (
                            <form
                                className='student-resume-skill-form'
                                onSubmit={(event) => void handleAddSkill(event)}
                            >
                                <input
                                    value={skillInput}
                                    onChange={(event) =>
                                        setSkillInput(event.target.value)
                                    }
                                    placeholder='Adicionar habilidade'
                                    maxLength={100}
                                />
                                <button
                                    className='student-resume-button student-resume-button--primary'
                                    type='submit'
                                    disabled={isManagingSkill}
                                >
                                    <AddIcon fontSize='small' />
                                    Adicionar
                                </button>
                            </form>
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}
