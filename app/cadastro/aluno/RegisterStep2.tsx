import { Input, RadioGroup } from '@/components/base';
import { Scholarship, UserRegisterPayload } from '@/dtos/UserDto';
import { useGetPublicCep } from '@/services/api-external/cep/queries';
import HomeIcon from '@mui/icons-material/Home';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';
import { InputAdornment } from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Opções de escolaridade - valores únicos e labels corretos
const ScholarshipRadioOptions = [
    {
        label: 'Fundamental Incompleto',
        value: Scholarship.INCOMPLETE_FUNDAMENTAL,
    },
    { label: 'Médio Completo', value: Scholarship.COMPLETE_MEDIUM },
    { label: 'Superior Incompleto', value: Scholarship.INCOMPLETE_SUPERIOR },
    { label: 'Superior Completo', value: Scholarship.COMPLETE_SUPERIOR },
];

export function RegisterStep2({
    form,
    setForm,
}: {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>;
}) {
    const [cepInput, setCepInput] = useState<string>('');

    const {
        data: cepData,
        error,
        isLoading: loadingCep,
    } = useGetPublicCep(cepInput);

    // Preenche os campos de endereço quando a API retorna dados do CEP
    useEffect(() => {
        if (!cepData || cepData.erro === 'true') {
            if (cepData?.erro === 'true' && cepInput.length === 8) {
                toast.error('CEP inválido');
            }
            return;
        }
        setForm((prevState) => ({
            ...prevState,
            address: cepData.logradouro,
            neighbourhood: cepData.bairro,
            state: cepData.uf,
            city: cepData.localidade,
        }));
    }, [cepData, cepInput]);

    // Limpa os campos de endereço quando o CEP é deletado
    useEffect(() => {
        if ((cepInput ?? '').length < 8) {
            setForm((prevState: UserRegisterPayload) => ({
                ...prevState,
                address: '',
                neighbourhood: '',
                city: '',
                state: '',
            }));
        }
    }, [cepInput]);

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, []);

    function onCepChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        const raw = newValue?.target?.value ?? '';
        if (raw.length > 8) return;

        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            cep: raw,
        }));

        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            setCepInput(raw);
        }, 400);
    }

    function onAddressChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            address: newValue?.target?.value ?? '',
        }));
    }

    function onComplementChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            complement: newValue?.target?.value ?? '',
        }));
    }

    function onNeighbourhoodChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            neighbourhood: newValue?.target?.value ?? '',
        }));
    }

    function onCityChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            city: newValue?.target?.value ?? '',
        }));
    }

    function onScholarshipChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            scholarship: value as Scholarship,
        }));
    }

    function onCourseChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            course: newValue?.target?.value ?? '',
        }));
    }

    function onInstitutionChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            institution: newValue?.target?.value ?? '',
        }));
    }

    return (
        <div className='register-steps'>
            {/* Seção Endereço */}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <HomeIcon />
                </InputAdornment>
                <span>Endereço</span>
            </div>

            <div className='register-steps__grid'>
                <div className='register-steps__field register-steps__field--small'>
                    <p className='field-label'>
                        CEP <span className='required'>*</span>
                    </p>
                    <Input
                        placeholder='00000-000'
                        onChange={onCepChange}
                        value={form.cep ?? ''}
                        disabled={loadingCep}
                    />
                </div>

                <div className='register-steps__field register-steps__field--large'>
                    <p className='field-label'>
                        Endereço <span className='required'>*</span>
                    </p>
                    <Input
                        placeholder='Ex: Ipiranga, 1234'
                        onChange={onAddressChange}
                        value={form.address ?? ''}
                    />
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>Complemento</p>
                    <Input
                        placeholder='Apto, Bloco, Casa...'
                        onChange={onComplementChange}
                        value={form.complement ?? ''}
                    />
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>
                        Bairro <span className='required'>*</span>
                    </p>
                    <Input
                        placeholder='Ex: Bela Vista'
                        onChange={onNeighbourhoodChange}
                        value={form.neighbourhood ?? ''}
                    />
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>
                        Cidade <span className='required'>*</span>
                    </p>
                    <Input
                        placeholder='Ex: São Paulo'
                        onChange={onCityChange}
                        value={form.city ?? ''}
                    />
                </div>

                <div className='register-steps__field register-steps__field--small'>
                    <p className='field-label'>
                        Estado <span className='required'>*</span>
                    </p>
                    <Input placeholder='UF' value={form.state ?? ''} />
                </div>
            </div>

            {/* Seção Escolaridade */}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <SchoolSharpIcon />
                </InputAdornment>
                <span>Escolaridade</span>
            </div>

            <div className='register-steps__grid'>
                {/* Nível de escolaridade - ocupa a linha inteira */}
                <div className='register-steps__field register-steps__field--full'>
                    <p className='field-label'>
                        Nível de escolaridade{' '}
                        <span className='required'>*</span>
                    </p>

                    <RadioGroup
                        value={form.scholarship ?? undefined}
                        options={ScholarshipRadioOptions}
                        onChange={onScholarshipChange}
                    />
                </div>

                {/* Curso - metade da linha */}
                <div className='register-steps__field register-steps__field--small'>
                    <p className='field-label'>Curso</p>
                    <Input
                        placeholder='Ex: Ciência da Computação'
                        onChange={onCourseChange}
                        value={form.course ?? ''}
                    />
                </div>

                {/* Instituição de Ensino - metade da linha */}
                <div className='register-steps__field register-steps__field--small'>
                    <p className='field-label'>Instituição de Ensino</p>
                    <Input
                        placeholder='Ex: PUCRS'
                        onChange={onInstitutionChange}
                        value={form.institution ?? ''}
                    />
                </div>
            </div>
        </div>
    );
}

export function validateFormStep2(form: UserRegisterPayload) {
    if (
        !form.cep?.replace(/\D/g, '') ||
        form.cep.replace(/\D/g, '').length !== 8
    ) {
        toast.error('CEP inválido ou faltante');
        throw new Error('Missing parameter');
    }
    if (!form.address?.trim()) {
        toast.error('Endereço é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.neighbourhood?.trim()) {
        toast.error('Bairro é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.city?.trim()) {
        toast.error('Cidade é obrigatória');
        throw new Error('Missing parameter');
    }
    if (!form.state?.trim()) {
        toast.error('Estado é obrigatório');
        throw new Error('Missing parameter');
    }
    if (!form.scholarship) {
        toast.error('Nível de escolaridade é obrigatório');
        throw new Error('Missing parameter');
    }
}
