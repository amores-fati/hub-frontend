import { Input, RadioGroup } from '@/components/base';
import {
    AccessibleForward as AccessibleForwardIcon,
    Description as DescriptionIcon,
    Handshake as HandshakeIcon,
    HearingDisabled as HearingDisabledIcon,
    MoreHoriz as MoreHorizIcon,
    Psychology as PsychologyIcon,
    SettingsEthernet as SettingsEthernetIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import { EditProfileForm, EditProfileFormSetter } from '../types';
import { SectionCard } from './SectionCard';

const AccessibilityOptions = [
    { label: 'Física', value: 'FISICA', icon: <AccessibleForwardIcon /> },
    { label: 'Visual', value: 'VISUAL', icon: <VisibilityIcon /> },
    { label: 'Auditiva', value: 'AUDITIVA', icon: <HearingDisabledIcon /> },
    { label: 'Intelectual', value: 'INTELECTUAL', icon: <PsychologyIcon /> },
    { label: 'Psicossocial', value: 'PSICOSSOCIAL', icon: <HandshakeIcon /> },
    { label: 'Múltipla', value: 'MULTIPLA', icon: <SettingsEthernetIcon /> },
    { label: 'Outra', value: 'OUTRA', icon: <MoreHorizIcon /> },
];

const YesNoOptions = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
];

type Props = {
    form: EditProfileForm;
    setForm: EditProfileFormSetter;
};

export function DadosPessoaisSection({ form, setForm }: Props) {
    function onFullNameChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, fullName: e.target.value }));
    }

    function onSocialNameChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, socialName: e.target.value }));
    }

    function onHasDisabilityChange(
        _: ChangeEvent<HTMLInputElement>,
        value: string,
    ) {
        const hasDisability = value === 'true';
        setForm((prev) => ({
            ...prev,
            hasDisability,
            disabilityTypes: hasDisability ? prev.disabilityTypes : [],
        }));
    }

    function onDisabilityTypeChange(value: string, checked: boolean) {
        setForm((prev) => {
            const next = checked
                ? Array.from(new Set([...prev.disabilityTypes, value]))
                : prev.disabilityTypes.filter((t) => t !== value);
            return { ...prev, disabilityTypes: next };
        });
    }

    return (
        <SectionCard icon={<DescriptionIcon />} title='Dados Pessoais'>
            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>Nome Completo</label>
                    <Input
                        placeholder='Ex: Rafael Henrique Silva'
                        value={form.fullName}
                        onChange={onFullNameChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>CPF</label>
                    <p className='perfil-field__readonly'>{form.cpf || '—'}</p>
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Nome Social</label>
                    <Input
                        placeholder='Ex: Rafael Henrique Silva'
                        value={form.socialName}
                        onChange={onSocialNameChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Pessoa com Deficiência (PcD)?
                    </label>
                    <RadioGroup
                        value={String(form.hasDisability)}
                        options={YesNoOptions}
                        onChange={onHasDisabilityChange}
                    />
                </div>
            </div>

            {form.hasDisability && (
                <div className='perfil-disability'>
                    <p className='perfil-disability__label'>
                        Marque o(s) tipo(s) de deficiência:
                    </p>
                    <div className='perfil-disability__grid'>
                        {AccessibilityOptions.map(({ label, value, icon }) => (
                            <FormControlLabel
                                key={value}
                                className='perfil-disability__item'
                                control={
                                    <Checkbox
                                        size='small'
                                        checked={form.disabilityTypes.includes(
                                            value,
                                        )}
                                        onChange={(_, checked) =>
                                            onDisabilityTypeChange(
                                                value,
                                                checked,
                                            )
                                        }
                                    />
                                }
                                label={
                                    <span className='perfil-disability__label-row'>
                                        {label}
                                        <span className='perfil-disability__icon'>
                                            {icon}
                                        </span>
                                    </span>
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </SectionCard>
    );
}
