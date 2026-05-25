import { Input, RadioGroup } from '@/components/base';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { ChangeEvent } from 'react';
import { EditProfileForm, EditProfileFormSetter } from '../Types';
import { SectionCard } from './SectionCard';

const YesNoOptions = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
];

type Props = {
    form: EditProfileForm;
    setForm: EditProfileFormSetter;
};

export function PerfilProfissionalSection({ form, setForm }: Props) {
    function onCurrentlyWorkingChange(
        _: ChangeEvent<HTMLInputElement>,
        value: string,
    ) {
        const isWorking = value === 'true';
        setForm((prev) => ({
            ...prev,
            currentlyWorking: isWorking,
            activityArea: isWorking ? prev.activityArea : '',
        }));
    }

    function onActivityAreaChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, activityArea: e.target.value }));
    }

    function onHasProgrammingExperienceChange(
        _: ChangeEvent<HTMLInputElement>,
        value: string,
    ) {
        setForm((prev) => ({
            ...prev,
            hasProgrammingExperience: value === 'true',
        }));
    }

    function onHasParticipatedOnCoursesChange(
        _: ChangeEvent<HTMLInputElement>,
        value: string,
    ) {
        setForm((prev) => ({
            ...prev,
            hasParticipatedOnCourses: value === 'true',
        }));
    }

    return (
        <SectionCard icon={<WorkOutlineIcon />} title='Perfil Profissional'>
            <div className='perfil-field'>
                <label className='perfil-field__label'>
                    Você está trabalhando atualmente?
                </label>
                <RadioGroup
                    value={String(form.currentlyWorking)}
                    options={YesNoOptions}
                    onChange={onCurrentlyWorkingChange}
                />
            </div>

            {form.currentlyWorking && (
                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Área de atuação
                    </label>
                    <Input
                        placeholder='Ex: Vendas, Administrativo...'
                        value={form.activityArea}
                        onChange={onActivityAreaChange}
                    />
                </div>
            )}

            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Já trabalhou com programação?
                    </label>
                    <RadioGroup
                        value={
                            form.hasProgrammingExperience === undefined
                                ? undefined
                                : String(form.hasProgrammingExperience)
                        }
                        options={YesNoOptions}
                        onChange={onHasProgrammingExperienceChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Já participou de curso de tecnologia?
                    </label>
                    <RadioGroup
                        value={
                            form.hasParticipatedOnCourses === undefined
                                ? undefined
                                : String(form.hasParticipatedOnCourses)
                        }
                        options={YesNoOptions}
                        onChange={onHasParticipatedOnCoursesChange}
                    />
                </div>
            </div>
        </SectionCard>
    );
}
