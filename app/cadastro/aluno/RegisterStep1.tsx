import { Input, RadioGroup, Select } from "@/components/base";
import { Gender, Race, UserRegisterPayload } from "@/dtos/UserDto";
import DescriptionIcon from '@mui/icons-material/Description';
import { InputAdornment } from "@mui/material";
import React, { ChangeEvent } from "react";
import { SingleValue } from "react-select";
import { Option } from "../../../components/base/Select/select";
import { cpfRegex, dateRegex, phoneNumberRegex } from "../../../utils/regex";
import { toast } from "react-toastify";

const GenderRadioOptions = [
    {
        label: 'Feminino',
        value: Gender.FEMALE
    },
    {
        label: 'Masculino',
        value: Gender.MALE
    },
    {
        label: 'Não-binário',
        value: Gender.NON_BINARY
    },
    {
        label: 'Prefiro não informar',
        value: Gender.PREFER_NOT_TO_SAY
    },
    {
        label: 'Outro',
        value: Gender.OTHER
    }
];

const RaceRadioOptions = [
    {
        label: 'Branco',
        value: Race.WHITE
    },
    {
        label: 'Preto',
        value: Race.BLACK
    },
    {
        label: 'Pardo',
        value: Race.BROWN
    },
    {
        label: 'Indígena',
        value: Race.INDIGENOUS
    },
    {
        label: 'Prefiro não dizer',
        value: Race.PREFER_NOT_TO_SAY
    },
]

export function RegisterStep1({ form, setForm }:
    {
        form: UserRegisterPayload;
        setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>
    }) {

    function onFullNameChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            fullName: newValue?.target?.value ?? '',
        }));
    }

    function onSocialNameChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            socialName: newValue?.target?.value ?? '',
        }));
    }

    function onCpfChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            cpf: cpfRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onBirthDateChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm({ ...form, birthDate: dateRegex(newValue?.target?.value ?? null) ?? '' });
    }

    function onPhoneNumberChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            phoneNumber: phoneNumberRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onEmailChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            email: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            password: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordConfirmationChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            passwordConfirmation: newValue?.target?.value ?? '',
        }));
    }

    function onGenderChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            gender: value as Gender,
        }));
    }

    function onRaceChange(newValue: SingleValue<Option>) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            race: newValue?.value as Race,
        }));
    }

    return (
        <div className='register-steps'>
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <DescriptionIcon />
                </InputAdornment>
                <span>Dados Pessoais</span>
            </div>

            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>Nome Completo <span className='required'>*</span></p>
                    <Input placeholder='Ex: João da Silva' onChange={onFullNameChange} value={form.fullName} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Nome Social</p>
                    <Input placeholder='Ex: João da Silva' onChange={onSocialNameChange} value={form.socialName ?? ''} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>CPF <span className='required'>*</span></p>
                    <Input placeholder='000.000.000-00' onChange={onCpfChange} value={form.cpf} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Data de Nascimento <span className='required'>*</span></p>
                    <Input placeholder='dd/mm/aaaa' onChange={onBirthDateChange} value={form.birthDate} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Telefone / Celular <span className='required'>*</span></p>
                    <Input placeholder='(00) 00000-0000' onChange={onPhoneNumberChange} value={form.phoneNumber} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Email <span className='required'>*</span></p>
                    <Input placeholder='seu@email.com' onChange={onEmailChange} value={form.email} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Senha <span className='required'>*</span></p>
                    <Input type="password" placeholder='Mínimo 8 caracteres' onChange={onPasswordChange} value={form.password} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Confirme a Senha <span className='required'>*</span></p>
                    <Input error={form.password !== form.passwordConfirmation} type='password' placeholder='As senhas devem ser as mesmas' onChange={onPasswordConfirmationChange} value={form.passwordConfirmation} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Gênero</p>
                    <RadioGroup value={form.gender} options={GenderRadioOptions} onChange={onGenderChange} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Cor/Raça</p>
                    <Select
                        value={RaceRadioOptions.find((option) => option.value === form.race)}
                        placeholder="Cor/Raça"
                        options={RaceRadioOptions}
                        onChange={onRaceChange}
                    />
                </div>
            </div>
        </div>
    );
}

export function validateFormStep1(form: UserRegisterPayload) {
    if (!form.fullName?.trim()) {
        toast.error('Nome completo é obrigatório');
        throw ('Missing parameter');
    }
    if (!form.cpf || form.cpf.replace(/\D/g, '').length !== 11) {
        toast.error('CPF inválido');
        throw ('Missing parameter');
    }
    if (!form.birthDate || form.birthDate.length !== 10) {
        toast.error('Data de nascimento inválida');
        throw ('Missing parameter');
    }
    if (!form.phoneNumber?.trim()) {
        toast.error('Telefone é obrigatório');
        throw ('Missing parameter');
    }
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        toast.error('Email inválido');
        throw ('Missing parameter');
    }
    if (!form.password || form.password.length < 8) {
        toast.error('Senha deve ter no mínimo 8 caracteres');
        throw ('Missing parameter');
    }
    if (form.password !== form.passwordConfirmation) {
        toast.error('As senhas não conferem');
        throw ('Missing parameter');
    }
}