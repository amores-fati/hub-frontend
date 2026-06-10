'use client';

import { Input, RadioGroup } from '@/components/base';
import Checkbox from '@/components/base/Checkbox/checkbox';
import { ButtonComponent } from '@/components/base/Button/button';
import {
    CreateOrUpdateVacancyDto,
    VacancyDto,
    WorkplaceType,
} from '@/dtos/VacancyDto';
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    useCreateVacancy,
    useUpdateVacancy,
} from '@/services/api/companies/vacancies/mutations';
import './vacancy-modal.scss';

export type VacancyModalMode = 'create' | 'edit' | 'view';

type VacancyModalProps = {
    open: boolean;
    mode: VacancyModalMode;
    vacancy?: VacancyDto;
    onClose: () => void;
};

const SKILLS_OPTIONS = [
    'Java',
    'Python',
    'FastAPI',
    'React',
    'Node.js',
    'TypeScript',
    'HTML',
    'CSS',
    'SQL',
    'Docker',
    'Figma',
    'UX Research',
    'Spring Boot',
    'Kubernetes',
    'Scrum',
];

const workplaceTypeLabels: Record<WorkplaceType, string> = {
    [WorkplaceType.PRESENTIAL]: 'Presencial',
    [WorkplaceType.ONLINE]: 'Online',
    [WorkplaceType.HYBRID]: 'Híbrido',
};

const titleMap: Record<VacancyModalMode, string> = {
    create: 'Cadastrar Nova Vaga',
    edit: 'Editar Vaga',
    view: 'Detalhes da Vaga',
};

const submitLabelMap: Record<VacancyModalMode, string> = {
    create: 'Cadastrar Vaga',
    edit: 'Salvar Alterações',
    view: '',
};

type FormState = {
    title: string;
    description: string;
    link: string;
    vacancyCount: string;
    isPcd: 'true' | 'false' | '';
    workplaceType: WorkplaceType | '';
    skills: string[];
};

const emptyForm: FormState = {
    title: '',
    description: '',
    link: '',
    vacancyCount: '',
    isPcd: '',
    workplaceType: '',
    skills: [],
};

const vacancyToForm = (vacancy: VacancyDto): FormState => ({
    title: vacancy.title,
    description: vacancy.description ?? '',
    link: vacancy.link ?? '',
    vacancyCount: String(vacancy.vacancyCount),
    isPcd: vacancy.isPcd ? 'true' : 'false',
    workplaceType: vacancy.workplaceType ?? '',
    skills: vacancy.skills ?? [],
});

export function VacancyModal({
    open,
    mode,
    vacancy,
    onClose,
}: VacancyModalProps) {
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<
        Partial<Record<keyof FormState, string>>
    >({});

    const createMutation = useCreateVacancy();
    const updateMutation = useUpdateVacancy();
    const isPending = createMutation.isPending || updateMutation.isPending;
    const isReadOnly = mode === 'view';

    useEffect(() => {
        if (!open) return;
        if (mode === 'create') {
            setForm(emptyForm);
        } else if (vacancy) {
            setForm(vacancyToForm(vacancy));
        }
        setErrors({});
    }, [open, mode, vacancy]);

    const setField = <K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const toggleSkill = (skill: string) => {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const validate = (): boolean => {
        const next: Partial<Record<keyof FormState, string>> = {};
        if (!form.title.trim()) next.title = 'Campo obrigatório';
        if (!form.description.trim()) next.description = 'Campo obrigatório';
        if (!form.link.trim()) {
            next.link = 'Campo obrigatório';
        } else if (!/^https?:\/\//i.test(form.link.trim())) {
            next.link =
                'Informe uma URL válida (deve começar com http:// ou https://)';
        }
        const count = Number(form.vacancyCount);
        if (
            !form.vacancyCount ||
            count < 1 ||
            !Number.isInteger(count) ||
            count > 9999
        )
            next.vacancyCount = 'Informe um número inteiro entre 1 e 9999';
        if (!form.isPcd) next.isPcd = 'Selecione uma opção';
        if (!form.workplaceType) next.workplaceType = 'Selecione uma opção';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const buildPayload = (): CreateOrUpdateVacancyDto => ({
        title: form.title.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
        vacancyCount: Number(form.vacancyCount),
        isPcd: form.isPcd === 'true',
        workplaceType: form.workplaceType as WorkplaceType,
        skills: form.skills,
    });

    const handleSubmit = async () => {
        if (!validate()) return;
        const payload = buildPayload();
        try {
            if (mode === 'create') {
                await createMutation.mutateAsync(payload);
            } else if (mode === 'edit' && vacancy) {
                await updateMutation.mutateAsync({ id: vacancy.id, payload });
            }
            onClose();
        } catch {
            toast.error('Não foi possível salvar a vaga. Tente novamente.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle className='vacancy-modal__title'>
                {titleMap[mode]}
            </DialogTitle>

            <DialogContent dividers className='vacancy-modal__content'>
                {isReadOnly ? (
                    <ViewContent vacancy={vacancy} />
                ) : (
                    <FormContent
                        form={form}
                        errors={errors}
                        onField={setField}
                        onToggleSkill={toggleSkill}
                    />
                )}
            </DialogContent>

            <DialogActions className='vacancy-modal__actions'>
                <ButtonComponent variant='secondary' onClick={onClose}>
                    Cancelar
                </ButtonComponent>

                {!isReadOnly && (
                    <ButtonComponent
                        onClick={() => {
                            void handleSubmit();
                        }}
                        disabled={isPending}
                    >
                        <span className='vacancy-modal__button-content'>
                            {isPending && <CircularProgress size={16} />}
                            {submitLabelMap[mode]}
                        </span>
                    </ButtonComponent>
                )}
            </DialogActions>
        </Dialog>
    );
}

function FormContent({
    form,
    errors,
    onField,
    onToggleSkill,
}: {
    form: FormState;
    errors: Partial<Record<keyof FormState, string>>;
    onField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    onToggleSkill: (skill: string) => void;
}) {
    return (
        <div className='vacancy-modal__form'>
            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>Nome da Vaga</label>
                <Input
                    value={form.title}
                    onChange={(e) => onField('title', e.target.value)}
                    placeholder='Ex: Desenvolvedor Web Full Stack'
                    error={!!errors.title}
                />
                {errors.title && (
                    <span className='vacancy-modal__error'>{errors.title}</span>
                )}
            </div>

            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>Descrição Breve</label>
                <TextField
                    multiline
                    minRows={3}
                    fullWidth
                    className='vacancy-modal__textarea'
                    placeholder='Uma breve descrição sobre a vaga, as skill necessários e nível de senioridade...'
                    value={form.description}
                    onChange={(e) => onField('description', e.target.value)}
                    error={!!errors.description}
                />
                {errors.description && (
                    <span className='vacancy-modal__error'>
                        {errors.description}
                    </span>
                )}
            </div>

            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>Link da Vaga</label>
                <Input
                    value={form.link}
                    onChange={(e) => onField('link', e.target.value)}
                    placeholder='Ex: https://candidatar-vaga-dev.com.br'
                    error={!!errors.link}
                />
                {errors.link && (
                    <span className='vacancy-modal__error'>{errors.link}</span>
                )}
            </div>

            <div className='vacancy-modal__row'>
                <div className='vacancy-modal__field'>
                    <label className='vacancy-modal__label'>
                        Número de Vagas
                    </label>
                    <Input
                        type='number'
                        value={form.vacancyCount}
                        onChange={(e) =>
                            onField('vacancyCount', e.target.value)
                        }
                        placeholder='Ex: 2'
                        error={!!errors.vacancyCount}
                    />
                    {errors.vacancyCount && (
                        <span className='vacancy-modal__error'>
                            {errors.vacancyCount}
                        </span>
                    )}
                </div>

                <div className='vacancy-modal__field'>
                    <label className='vacancy-modal__label'>É PCD?</label>
                    <RadioGroup
                        value={form.isPcd}
                        options={[
                            { value: 'true', label: 'Sim' },
                            { value: 'false', label: 'Não' },
                        ]}
                        onChange={(_, value) =>
                            onField('isPcd', value as 'true' | 'false')
                        }
                    />
                    {errors.isPcd && (
                        <span className='vacancy-modal__error'>
                            {errors.isPcd}
                        </span>
                    )}
                </div>
            </div>

            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>Tipo de Vaga</label>
                <RadioGroup
                    value={form.workplaceType}
                    options={[
                        {
                            value: WorkplaceType.PRESENTIAL,
                            label: 'Presencial',
                        },
                        { value: WorkplaceType.ONLINE, label: 'Online' },
                        { value: WorkplaceType.HYBRID, label: 'Híbrido' },
                    ]}
                    onChange={(_, value) =>
                        onField('workplaceType', value as WorkplaceType)
                    }
                />
                {errors.workplaceType && (
                    <span className='vacancy-modal__error'>
                        {errors.workplaceType}
                    </span>
                )}
            </div>

            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>
                    Seleciona as Skills desejadas
                </label>
                <div className='vacancy-modal__skills-grid'>
                    {SKILLS_OPTIONS.map((skill) => (
                        <label
                            key={skill}
                            className='vacancy-modal__skill-option'
                        >
                            <Checkbox
                                checked={form.skills.includes(skill)}
                                onChange={() => onToggleSkill(skill)}
                            />
                            {skill}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ViewContent({ vacancy }: { vacancy?: VacancyDto }) {
    if (!vacancy) return null;

    return (
        <div className='vacancy-modal__view'>
            <div className='vacancy-modal__view-grid'>
                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Nome da Vaga</strong>
                    <span>{vacancy.title}</span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Descrição</strong>
                    <span>{vacancy.description || 'Não informado'}</span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Link da Vaga</strong>
                    <a
                        href={vacancy.link ?? undefined}
                        target='_blank'
                        rel='noreferrer'
                        className='vacancy-modal__link'
                    >
                        {vacancy.link || 'Não informado'}
                    </a>
                </div>

                <div className='vacancy-modal__view-item'>
                    <strong>Número de Vagas</strong>
                    <span>{vacancy.vacancyCount}</span>
                </div>

                <div className='vacancy-modal__view-item'>
                    <strong>É PCD?</strong>
                    <span>{vacancy.isPcd ? 'Sim' : 'Não'}</span>
                </div>

                <div className='vacancy-modal__view-item'>
                    <strong>Tipo de Vaga</strong>
                    <span>
                        {vacancy.workplaceType
                            ? workplaceTypeLabels[vacancy.workplaceType]
                            : 'Não informado'}
                    </span>
                </div>

                <div className='vacancy-modal__view-item'>
                    <strong>Data de Anúncio</strong>
                    <span>
                        {(() => {
                            const d = new Date(vacancy.announcementDate);
                            return Number.isNaN(d.getTime())
                                ? vacancy.announcementDate
                                : new Intl.DateTimeFormat('pt-BR', {
                                      timeZone: 'UTC',
                                  }).format(d);
                        })()}
                    </span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Skills</strong>
                    {vacancy.skills && vacancy.skills.length > 0 ? (
                        <div className='vacancy-modal__skills-tags'>
                            {vacancy.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className='vacancy-modal__skill-tag'
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span>Nenhuma skill informada</span>
                    )}
                </div>
            </div>
        </div>
    );
}
