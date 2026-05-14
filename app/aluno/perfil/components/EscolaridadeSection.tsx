import { Input, RadioGroup } from '@/components/base';
import { Scholarship } from '@/dtos/StudentDto';
import SchoolIcon from '@mui/icons-material/School';
import { ChangeEvent } from 'react';
import { EditProfileForm, EditProfileFormSetter } from '../types';
import { SectionCard } from './SectionCard';

const ScholarshipOptions = [
    { label: 'Fundamental Incompleto', value: Scholarship.NO_EDUCATION },
    { label: 'Fundamental Completo', value: Scholarship.PRIMARY },
    { label: 'Médio Completo', value: Scholarship.SECONDARY },
    { label: 'Superior Completo', value: Scholarship.HIGHER },
    { label: 'Pós-graduação', value: Scholarship.POSTGRADUATE },
];

type Props = {
    form: EditProfileForm;
    setForm: EditProfileFormSetter;
};

export function EscolaridadeSection({ form, setForm }: Props) {
    function onEducationChange(
        _: ChangeEvent<HTMLInputElement>,
        value: string,
    ) {
        setForm((prev) => ({ ...prev, education: value as Scholarship }));
    }

    function onCourseChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, course: e.target.value }));
    }

    function onInstitutionChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, institution: e.target.value }));
    }

    return (
        <SectionCard icon={<SchoolIcon />} title='Escolaridade'>
            <div className='perfil-field'>
                <label className='perfil-field__label'>
                    Nível de escolaridade
                </label>
                <div className='perfil-scholarship'>
                    <RadioGroup
                        value={form.education}
                        options={ScholarshipOptions}
                        onChange={onEducationChange}
                    />
                </div>
            </div>

            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>Curso</label>
                    <Input
                        placeholder='Nome do curso'
                        value={form.course}
                        onChange={onCourseChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Instituição de ensino
                    </label>
                    <Input
                        placeholder='Nome da instituição'
                        value={form.institution}
                        onChange={onInstitutionChange}
                    />
                </div>
            </div>
        </SectionCard>
    );
}
