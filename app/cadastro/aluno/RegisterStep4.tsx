import { Input } from "@/components/base";
import { UserRegisterPayload } from "@/dtos/UserDto";
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import GavelIcon from '@mui/icons-material/Gavel';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox, FormControlLabel, InputAdornment, RadioGroup as MuiRadioGroup, Radio } from "@mui/material";
import React, { ChangeEvent } from "react";

const AccessibilityOptions = [
    { label: 'Física', value: 'FISICA', icon: <AccessibleForwardIcon /> },
    { label: 'Visual', value: 'VISUAL', icon: <VisibilityIcon /> },
    { label: 'Auditiva', value: 'AUDITIVA', icon: <HearingDisabledIcon /> },
    { label: 'Intelectual', value: 'INTELECTUAL', icon: <PsychologyIcon /> },
    { label: 'Psicossocial', value: 'PSICOSSOCIAL', icon: <HandshakeIcon /> },
    { label: 'Múltipla', value: 'MULTIPLA', icon: <SettingsEthernetIcon /> },
    { label: 'Outra', value: 'OUTRA', icon: <MoreHorizIcon /> },
];


export function RegisterStep4({ form, setForm }: {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>;
}) {

    // ── Experiência ───────────────────────────────────────────────────────────

    function onHasWorkExperienceChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            hasWorkExperience: value === 'true',
        }));
    }

    function onHasParticipatedOnCoursesChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            hasParticipatedOnCourses: value === 'true',
        }));
    }

    function onCurrentlyWorkingChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        const isWorking = value === 'true';
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            currentlyWorking: isWorking,
            workField: isWorking ? prevState.workField : '',
        }));
    }

    function onWorkFieldChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            workField: newValue?.target?.value ?? '',
        }));
    }

    // ── Acessibilidade ────────────────────────────────────────────────────────

    function onHasAccessabilityChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        const hasPcd = value === 'true';
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            hasAccessability: hasPcd,
            typeAccessability: hasPcd ? prevState.typeAccessability : '',
        }));
    }

    function onAccessibilityTypeChange(value: string, checked: boolean) {
        setForm((prevState: UserRegisterPayload) => {
            // typeAccessability é string; armazenamos como CSV para suportar múltiplos
            const current = prevState.typeAccessability
                ? prevState.typeAccessability.split(',')
                : [];
            const updated = checked
                ? [...current, value]
                : current.filter((t) => t !== value);
            return { ...prevState, typeAccessability: updated.join(',') };
        });
    }

    // ── LGPD ──────────────────────────────────────────────────────────────────

    function onTermsChange(_: ChangeEvent<HTMLInputElement>, checked: boolean) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            lgpd: { ...prevState.lgpd, terms: checked },
        }));
    }

    function onImageUsageChange(_: ChangeEvent<HTMLInputElement>, checked: boolean) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            lgpd: { ...prevState.lgpd, imageUsage: checked },
        }));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    const selectedTypes = form.typeAccessability
        ? form.typeAccessability.split(',').filter(Boolean)
        : [];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className='register-steps'>

            {/* ── Experiência: 3 radio groups em linha ─────────────────────── */}
            <div className='register-steps__grid'>

                <div className='register-steps__field'>
                    <p className='field-label'>Já trabalhou com programação?</p>
                    <MuiRadioGroup
                        row
                        value={form.hasWorkExperience === undefined ? '' : String(form.hasWorkExperience)}
                        onChange={onHasWorkExperienceChange}
                    >
                        <FormControlLabel value='true' control={<Radio size='small' />} label='Sim' />
                        <FormControlLabel value='false' control={<Radio size='small' />} label='Não' />
                    </MuiRadioGroup>
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>Já participou de curso de tecnologia?</p>
                    <MuiRadioGroup
                        row
                        value={form.hasParticipatedOnCourses === undefined ? '' : String(form.hasParticipatedOnCourses)}
                        onChange={onHasParticipatedOnCoursesChange}
                    >
                        <FormControlLabel value='true' control={<Radio size='small' />} label='Sim' />
                        <FormControlLabel value='false' control={<Radio size='small' />} label='Não' />
                    </MuiRadioGroup>
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>Você está trabalhando atualmente?</p>
                    <MuiRadioGroup
                        row
                        value={String(form.currentlyWorking)}
                        onChange={onCurrentlyWorkingChange}
                    >
                        <FormControlLabel value='true' control={<Radio size='small' />} label='Sim' />
                        <FormControlLabel value='false' control={<Radio size='small' />} label='Não' />
                    </MuiRadioGroup>
                </div>

                {/* Área de atuação — linha inteira, só quando trabalhando */}
                {form.currentlyWorking && (
                    <div className='register-steps__field register-steps__field--full'>
                        <p className='field-label'>Área de atuação (se sim)</p>
                        <Input
                            placeholder='Ex: Vendas, Administrativo...'
                            onChange={onWorkFieldChange}
                            value={form.workField ?? ''}
                        />
                    </div>
                )}

            </div>

            {/* ── Acessibilidade ───────────────────────────────────────────── */}
            <div className='register-steps__accessibility-card'>

                <p className='register-steps__accessibility-title'>Acessibilidade</p>
                <p className='field-label'>Você é Pessoa com Deficiência (PcD)?</p>

                <MuiRadioGroup
                    row
                    value={String(form.hasAccessability)}
                    onChange={onHasAccessabilityChange}
                    sx={{ mb: 1 }}
                >
                    <FormControlLabel value='true' control={<Radio size='small' />} label='Sim' />
                    <FormControlLabel value='false' control={<Radio size='small' />} label='Não' />
                </MuiRadioGroup>

                {form.hasAccessability && (
                    <>
                        <p className='field-label' style={{ marginBottom: '0.75rem' }}>
                            Se sim, marque o tipo de deficiência:
                        </p>
                        <div className='register-steps__disability-grid'>
                            {AccessibilityOptions.map(({ label, value, icon }) => (
                                <FormControlLabel
                                    key={value}
                                    className='register-steps__disability-item'
                                    control={
                                        <Checkbox
                                            size='small'
                                            checked={selectedTypes.includes(value)}
                                            onChange={(_, checked) => onAccessibilityTypeChange(value, checked)}
                                        />
                                    }
                                    label={
                                        <span className='disability-label'>
                                            {label}
                                            <span className='disability-icon'>{icon}</span>
                                        </span>
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Autorizações ─────────────────────────────────────────────── */}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <GavelIcon />
                </InputAdornment>
                <span>Autorizações</span>
            </div>

            <div className='register-steps__terms-card'>
                <div className='register-steps__terms-header'>
                    <span className='terms-title'>TERMOS E PRIVACIDADE</span>
                    <a
                        className='terms-link'
                        href='/termos'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        LER TERMOS COMPLETOS
                    </a>
                </div>

                <FormControlLabel
                    control={
                        <Checkbox
                            size='small'
                            checked={form.lgpd?.terms ?? false}
                            onChange={onTermsChange}
                        />
                    }
                    label={
                        <span className='terms-item-label'>
                            Aceito os <strong>Termos de Uso</strong> e as políticas da LGPD.
                        </span>
                    }
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            size='small'
                            checked={form.lgpd?.imageUsage ?? false}
                            onChange={onImageUsageChange}
                        />
                    }
                    label={
                        <span className='terms-item-label'>
                            Você autoriza o uso da sua imagem para fins institucionais do Instituto Amores Fati.
                        </span>
                    }
                />
            </div>

        </div>
    );
}
