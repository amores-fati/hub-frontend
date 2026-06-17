'use client';

import { Input, Loading, RadioGroup } from '@/components/base';
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
import {
    useCreateVacancy,
    useUpdateVacancy,
} from '@/services/api/companies/vacancies/mutations';
import './vacancy-modal.scss';
import { formatDateToBR } from '../../../utils/shared-functions/date';
import { useGetSkills } from '../../../services/api/skills/queries';

export type VacancyModalMode = 'create' | 'edit' | 'view';

type VacancyModalProps = {
    open: boolean;
    mode: VacancyModalMode;
    vacancy: VacancyDto | null;
    onClose: () => void;
};

const workplaceTypeLabels: Record<WorkplaceType, string> = {
    [WorkplaceType.PRESENTIAL]: 'Presencial',
    [WorkplaceType.ONLINE]: 'Online',
    [WorkplaceType.HYBRID]: 'Híbrida',
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
    name: string;
    description: string;
    applicationLink: string;
    openingsCount: number;
    isPcd: 'true' | 'false' | '';
    workplaceType: WorkplaceType | '';
    skills: string[];
};

const emptyForm: FormState = {
    name: '',
    description: '',
    applicationLink: '',
    openingsCount: 0,
    isPcd: '',
    workplaceType: '',
    skills: [],
};

const vacancyToForm = (vacancy: VacancyDto): FormState => ({
    name: vacancy.name,
    description: vacancy.description ?? '',
    applicationLink: vacancy.applicationLink ?? '',
    openingsCount: vacancy.openingsCount,
    isPcd: vacancy.isPcd ? 'true' : 'false',
    workplaceType: vacancy.workplaceType ?? '',
    skills:
        vacancy && vacancy.skills
            ? vacancy.skills.map((skill) => skill.id)
            : [],
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
    const [isHydrated, setIsHydrated] = useState<boolean>(false);

    const { mutate: createMutation, isPending: isCreatePending } =
        useCreateVacancy();
    const { mutate: updateMutation, isPending: isUpdatePending } =
        useUpdateVacancy();
    const isPending = isCreatePending || isUpdatePending;
    const isReadOnly = mode === 'view';

    useEffect(() => {
        if (!open) return;
        if (vacancy) {
            setForm(vacancyToForm(vacancy));
        }
        setErrors({});
        setIsHydrated(true);
    }, [open, mode, vacancy]);

    if (!isHydrated) return <Loading />;

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
        if (!form.name.trim()) next.name = 'Campo obrigatório';
        if (!form.description.trim()) next.description = 'Campo obrigatório';
        if (!form.openingsCount || Number(form.openingsCount) < 1)
            next.openingsCount = 'Mínimo 1 vaga';
        if (!form.isPcd) next.isPcd = 'Selecione uma opção';
        if (!form.workplaceType) next.workplaceType = 'Selecione uma opção';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const buildPayload = (): CreateOrUpdateVacancyDto => ({
        name: form.name.trim(),
        description: form.description.trim(),
        applicationLink: form.applicationLink.trim(),
        openingsCount: form.openingsCount,
        isPcd: form.isPcd === 'true',
        workplaceType: form.workplaceType as WorkplaceType,
        skills: form.skills,
    });

    const handleSubmit = () => {
        if (!validate()) return;
        const payload = buildPayload();

        if (mode === 'create') {
            createMutation(payload);
        } else if (mode === 'edit' && vacancy) {
            updateMutation({ id: vacancy.id, payload });
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle className='vacancy-modal__title'>
                {titleMap[mode]}
            </DialogTitle>

            <DialogContent dividers className='vacancy-modal__content'>
                {isReadOnly ? (
                    <ViewContent vacancy={vacancy!} />
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
    const { data: skills, isLoading: isLoadingSkills } = useGetSkills();

    return (
        <div className='vacancy-modal__form'>
            <div className='vacancy-modal__field'>
                <label className='vacancy-modal__label'>Nome da Vaga</label>
                <Input
                    value={form.name}
                    onChange={(e) => onField('name', e.target.value)}
                    placeholder='Ex: Desenvolvedor Web Full Stack'
                    error={!!errors.name}
                />
                {errors.name && (
                    <span className='vacancy-modal__error'>{errors.name}</span>
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
                    value={form.applicationLink}
                    onChange={(e) => onField('applicationLink', e.target.value)}
                    placeholder='Ex: https://candidatar-vaga-dev.com.br'
                    error={!!errors.applicationLink}
                />
                {errors.applicationLink && (
                    <span className='vacancy-modal__error'>
                        {errors.applicationLink}
                    </span>
                )}
            </div>

            <div className='vacancy-modal__row'>
                <div className='vacancy-modal__field'>
                    <label className='vacancy-modal__label'>
                        Número de Vagas
                    </label>
                    <Input
                        type='number'
                        value={`${form.openingsCount}`}
                        onChange={(e) =>
                            onField('openingsCount', Number(e.target.value))
                        }
                        placeholder='Ex: 2'
                        error={!!errors.openingsCount}
                    />
                    {errors.openingsCount && (
                        <span className='vacancy-modal__error'>
                            {errors.openingsCount}
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
                        { value: WorkplaceType.HYBRID, label: 'Híbrida' },
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
                    {isLoadingSkills ? (
                        <Loading />
                    ) : (
                        skills?.map((skill) => (
                            <label
                                key={skill.id}
                                className='vacancy-modal__skill-option'
                            >
                                <Checkbox
                                    checked={form.skills.includes(skill.id)}
                                    onChange={() => onToggleSkill(skill.id)}
                                />
                                {skill.name}
                            </label>
                        ))
                    )}
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
                    <span>{vacancy.name}</span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Descrição</strong>
                    <span>{vacancy.description || 'Não informado'}</span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Link da Vaga</strong>
                    <a
                        href={vacancy.applicationLink ?? '#'}
                        target='_blank'
                        rel='noreferrer'
                        className='vacancy-modal__link'
                    >
                        {vacancy.applicationLink || 'Não informado'}
                    </a>
                </div>

                <div className='vacancy-modal__view-item'>
                    <strong>Número de Vagas</strong>
                    <span>{vacancy.openingsCount}</span>
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
                        {formatDateToBR(vacancy.announcementDate) ||
                            'Não informado'}
                    </span>
                </div>

                <div className='vacancy-modal__view-item vacancy-modal__view-item--full'>
                    <strong>Skills</strong>
                    {vacancy && vacancy.skills && vacancy.skills.length > 0 ? (
                        <div className='vacancy-modal__skills-tags'>
                            {vacancy.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className='vacancy-modal__skill-tag'
                                >
                                    {skill.name}
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
