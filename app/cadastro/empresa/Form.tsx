import { Input } from '@/components/base';
import { CompanyRegisterPayload } from '@/dtos/CompanyDto';
import { cnpjRegex, phoneNumberRegex } from '@/utils/regex';
import {
    Description as DescriptionIcon,
    LockOutline as LockOutlineIcon,
    Person as PersonIcon,
    Room as RoomIcon,
} from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetPublicCep } from '@/services/api-external/cep/queries';
import { useGetPublicCnpj } from '../../../services/api-external/cnpj/queries';

export function Form({
    form,
    setForm,
}: {
    form: CompanyRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<CompanyRegisterPayload>>;
}) {
    const [cepInput, setCepInput] = useState<string>('');
    const [cnpjInput, setCnpjInput] = useState<string>('');

    const { data: cepData, error: cepError } = useGetPublicCep(cepInput);
    const { data: cnpjData, error: cnpjError } = useGetPublicCnpj(cnpjInput);

    // Seta informações da api pública do cep para os campos de endereço
    useEffect(() => {
        if ((cepError || cepData?.erro === 'true') && form.cep?.length === 8) {
            toast.error('Cep inválido');
            return;
        }
        if (cepError && (!form.cep || form.cep?.length < 8)) {
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
    }, [cepData, cepError]);

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
    }, [cepInput]);

    useEffect(() => {
        if ((form.cnpj ?? '').length < 18) {
            return;
        }
        if (cnpjError) {
            toast.error('CNPJ inválido');
            return;
        }
        if (cnpjData) {
            setForm((prevState: CompanyRegisterPayload) => ({
                ...prevState,
                name: cnpjData.razao_social,
            }));
        }
    }, [cnpjData, cnpjError]);

    useEffect(() => {
        if ((cnpjInput ?? '').length < 14 || cnpjError) {
            setForm((prevState: CompanyRegisterPayload) => ({
                ...prevState,
                name: '',
            }));
        }
    }, [cnpjInput, cnpjError]);

    function onNameChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            name: newValue?.target?.value ?? '',
        }));
    }

    function onOwnerNameChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            ownerName: newValue?.target?.value ?? '',
        }));
    }

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    function onCnpjChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        if ((newValue?.target.value ?? '').length > 18) return;
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            cnpj: cnpjRegex(newValue?.target?.value ?? null) ?? '',
        }));

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setCnpjInput(
                (newValue?.target?.value ?? '')
                    .replaceAll('.', '')
                    .replaceAll('/', '')
                    .replaceAll('-', ''),
            );
        }, 400);
    }

    function onPhoneNumberChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            phoneNumber:
                phoneNumberRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onEmailChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            email: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            password: newValue?.target?.value ?? '',
        }));
    }

    function onPasswordConfirmationChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            passwordConfirmation: newValue?.target?.value ?? '',
        }));
    }

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

    function onAddressChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            address: newValue?.target?.value ?? '',
        }));
    }

    function onNeighbourhoodChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
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

    function onStateChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: CompanyRegisterPayload) => ({
            ...prevState,
            state: newValue?.target?.value ?? '',
        }));
    }

    function onComplementChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
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
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        CNPJ <span className='required'>*</span>
                    </p>
                    <Input onChange={onCnpjChange} value={form.cnpj} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        Email da Empresa <span className='required'>*</span>
                    </p>
                    <Input onChange={onEmailChange} value={form.email} />
                </div>
            </div>
            <div className='register-steps__grid-full'>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        Nome da Empresa (Razão Social){' '}
                        <span className='required'>*</span>
                    </p>
                    <Input
                        disabled={true}
                        onChange={onNameChange}
                        value={form.name}
                    />
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
                    <p className='field-label'>
                        CEP <span className='required'>*</span>
                    </p>
                    <Input onChange={onCepChange} value={form.cep} />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Complemento / Número</p>
                    <Input
                        onChange={onComplementChange}
                        value={form.complement ?? ''}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Rua</p>
                    <Input
                        disabled={true}
                        onChange={onAddressChange}
                        value={form.address ?? ''}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Bairro</p>
                    <Input
                        disabled={true}
                        onChange={onNeighbourhoodChange}
                        value={form.neighbourhood ?? ''}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Cidade</p>
                    <Input
                        disabled={true}
                        onChange={onCityChange}
                        value={form.city ?? ''}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>Estado</p>
                    <Input
                        disabled={true}
                        onChange={onStateChange}
                        value={form.state ?? ''}
                    />
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
                    <p className='field-label'>
                        Nome do Sócio Proprietário{' '}
                        <span className='required'>*</span>
                    </p>
                    <Input
                        onChange={onOwnerNameChange}
                        value={form.ownerName}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        Telefone / Whatsapp <span className='required'>*</span>
                    </p>
                    <Input
                        onChange={onPhoneNumberChange}
                        value={form.phoneNumber}
                    />
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
                    <p className='field-label'>
                        Senha <span className='required'>*</span>
                    </p>
                    <Input
                        type='password'
                        onChange={onPasswordChange}
                        value={form.password}
                    />
                </div>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        Confirme a Senha <span className='required'>*</span>
                    </p>
                    <Input
                        type='password'
                        onChange={onPasswordConfirmationChange}
                        value={form.passwordConfirmation}
                    />
                </div>
            </div>
        </div>
    );
}

export function validateForm(form: CompanyRegisterPayload) {
    if (!form.name) {
        toast.error('CNPJ inválido');
        throw new Error('Missing parameter');
    }
    if (!form.email) {
        toast.error('Email é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.cep) {
        toast.error('CEP é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.ownerName) {
        toast.error('Nome do sócio propietário é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.phoneNumber) {
        toast.error('Telefone / Whatsapp é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.password) {
        toast.error('Senha é obrigatório');
        throw new Error('Missing parameter');
    }
    if (form.password !== form.passwordConfirmation) {
        toast.error('Confirmação de senha está diferente da senha');
        throw new Error('Missing parameter');
    }
}
