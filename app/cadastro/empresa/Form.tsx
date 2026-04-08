import { Input } from "@/components/base";
import { CompanyRegisterPayload } from "@/dtos/CompanyDto";
import { UserRegisterPayload } from "@/dtos/UserDto";
import { cpfRegex, phoneNumberRegex } from "@/utils/regex";
import {
    Description as DescriptionIcon,
    LockOutline as LockOutlineIcon,
    Person as PersonIcon,
    Room as RoomIcon
} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGetPublicCep } from "../../../services/api-external/cep/queries";

export function Form({ form, setForm }:
    {
        form: CompanyRegisterPayload;
        setForm: React.Dispatch<React.SetStateAction<CompanyRegisterPayload>>
    }) {

    const [cepInput, setCepInput] = useState<string>('');

    const { data: cepData, error } = useGetPublicCep(cepInput);

    // Seta informações da api pública do cep para os campos de endereço
    useEffect(() => {
        if ((error || cepData?.erro === 'true') && form.cep?.length === 8) {
            toast.error('Cep inválido')
            return;
        }
        if (error && (!form.cep || form.cep?.length < 8)) {
            return;
        }

        if (cepData) {
            setForm((prevState: CompanyRegisterPayload) => ({
                ...prevState,
                address: cepData.logradouro,
                neighbourhood: cepData.bairro,
                state: cepData.uf,
                city: cepData.localidade,
            }));
        }
    }, [cepData])

    // Remove informações de endereço quando o cep é deletado
    useEffect(() => {
        if ((cepInput ?? '').length < 8) {
            setForm((prevState: CompanyRegisterPayload) => ({
                ...prevState,
                address: '',
                neighbourhood: '',
                city: '',
                state: '',
            }));
        }
    }, [cepInput])

    function onNameChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            name: newValue?.target?.value ?? '',
        }));
    }

    function onOwnerNameChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            ownerName: newValue?.target?.value ?? '',
        }));
    }

    function onCnpjChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            cnpj: cpfRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onPhoneNumberChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            phoneNumber: phoneNumberRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onEmailChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            email: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            password: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordConfirmationChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            passwordConfirmation: newValue?.target?.value ?? '',
        }));
    }

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    function onCepChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        if ((newValue?.target.value ?? '').length > 8) return;
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            cep: newValue?.target?.value ?? '',
        }));

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setCepInput(newValue?.target?.value ?? '');
        }, 400);
    }

    function onAddressChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            address: newValue?.target?.value ?? '',
        }));
    }

    function onNeighbourhoodChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            neighbourhood: newValue?.target?.value ?? '',
        }));
    }

    function onCityChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            city: newValue?.target?.value ?? '',
        }));
    }

    function onStateChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            state: newValue?.target?.value ?? '',
        }));
    }

    function onComplementChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            complement: newValue?.target?.value ?? '',
        }));
    }

    return (
        <div className='register-steps'>
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <DescriptionIcon />
                </InputAdornment>
                <span>Dados da Empresa</span>
            </div>
            <div className='register-steps__grid-full'>
                <div className='register-steps__field'>
                    <p className='field-label'>Nome da Empresa (Razão Social) <span className='required'>*</span></p>
                    <Input onChange={onNameChange} value={form.name} />
                </div>
            </div>
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>CNPJ <span className='required'>*</span></p>
                    <Input onChange={onCnpjChange} value={form.cnpj} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Email da Empresa <span className='required'>*</span></p>
                    <Input onChange={onEmailChange} value={form.email} />
                </div>
            </div>

            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <RoomIcon />
                </InputAdornment>
                <span>Endereço da Empresa</span>
            </div>
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>CEP <span className='required'>*</span></p>
                    <Input onChange={onCepChange} value={form.cep} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Complemento / Número</p>
                    <Input onChange={onComplementChange} value={form.complement ?? ''} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Rua</p>
                    <Input disabled={true} onChange={onAddressChange} value={form.address ?? ''} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Bairro</p>
                    <Input disabled={true} onChange={onNeighbourhoodChange} value={form.neighbourhood ?? ''} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Cidade</p>
                    <Input disabled={true} onChange={onCityChange} value={form.city ?? ''} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Estado</p>
                    <Input disabled={true} onChange={onStateChange} value={form.state ?? ''} />
                </div>
            </div>

            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <PersonIcon />
                </InputAdornment>
                <span>Responsável pela Empresa</span>
            </div>
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>Nome do Sócio Proprietário <span className='required'>*</span></p>
                    <Input onChange={onOwnerNameChange} value={form.ownerName} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Telefone / Whatsapp <span className='required'>*</span></p>
                    <Input onChange={onPhoneNumberChange} value={form.phoneNumber} />
                </div>
            </div>

            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <LockOutlineIcon />
                </InputAdornment>
                <span>Segurança da Conta</span>
            </div>
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>Senha <span className='required'>*</span></p>
                    <Input type='password' onChange={onPasswordChange} value={form.password} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Confirme a Senha <span className='required'>*</span></p>
                    <Input type='password' onChange={onPasswordConfirmationChange} value={form.passwordConfirmation} />
                </div>
            </div>
        </div >
    );
}

export function validateFormStep1(form: UserRegisterPayload) {
    if (!form.email) {
        toast.error('Email é obrigatório')
        throw ('Missing parameter');
    }
}