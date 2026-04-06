import { Input, RadioGroup, Select } from "@/components/base";
import { Gender, Race, UserRegisterPayload } from "@/dtos/UserDto";
import DescriptionIcon from '@mui/icons-material/Description';
import { InputAdornment } from "@mui/material";
import React, { ChangeEvent } from "react";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { Option } from "../../../components/base/Select/select";
import { cpfRegex, dateRegex, phoneNumberRegex } from "../../../utils/regex";

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
    if (!form.email) {
        toast.error('Email é obrigatório')
        throw ('Missing parameter');
    }
}