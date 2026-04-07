import { Input, RadioGroup, Select } from "@/components/base";
import { Scholarship, UserRegisterPayload } from "@/dtos/UserDto";
import HomeIcon from '@mui/icons-material/Home';
import { InputAdornment } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { Option } from "../../../components/base/Select/select";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';

// Opções de escolaridade - valores únicos e labels corretos
const ScholarshipRadioOptions = [
    { label: 'Fundamental Incompleto', value: 'FUNDAMENTAL_INCOMPLETO' },
    { label: 'Médio Completo', value: 'MEDIO_COMPLETO' },
    { label: 'Superior Incompleto', value: 'SUPERIOR_INCOMPLETO' },
    { label: 'Superior Completo', value: 'SUPERIOR_COMPLETO' },
];

const StateOptions = [
    { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' },
    { label: 'AP', value: 'AP' }, { label: 'AM', value: 'AM' },
    { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' },
    { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' },
    { label: 'GO', value: 'GO' }, { label: 'MA', value: 'MA' },
    { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
    { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' },
    { label: 'PB', value: 'PB' }, { label: 'PR', value: 'PR' },
    { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' },
    { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' },
    { label: 'RS', value: 'RS' }, { label: 'RO', value: 'RO' },
    { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
    { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' },
    { label: 'TO', value: 'TO' },
];

export function RegisterStep2({ form, setForm }: {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>
}) {
    const [loadingCep, setLoadingCep] = useState(false);

    function onCepChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        const rawCep = newValue?.target?.value ?? '';
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            cep: rawCep,
        }));

        const raw = rawCep.replace(/\D/g, '');
        if (raw.length === 8) {
            setLoadingCep(true);
            fetch(`https://viacep.com.br/ws/${raw}/json/`)
                .then((r) => r.json())
                .then((data) => {
                    if (!data.erro) {
                        setForm((prevState: UserRegisterPayload) => ({
                            ...prevState,
                            address: data.logradouro ?? prevState.address,
                            neighbourhood: data.bairro ?? prevState.neighbourhood,
                            city: data.localidade ?? prevState.city,
                            state: data.uf ?? prevState.state,
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar CEP:', error);
                })
                .finally(() => setLoadingCep(false));
        }
    }

    function onAddressChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            address: newValue?.target?.value ?? '',
        }));
    }

    function onComplementChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            complement: newValue?.target?.value ?? '',
        }));
    }

    function onNeighbourhoodChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
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

    function onStateChange(newValue: Option | null) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            state: newValue?.value as string ?? '',
        }));
    }

    function onScholarshipChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            scholarship: value as Scholarship,
        }));
    }

    function onCourseChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            course: newValue?.target?.value ?? '',
        }));
    }

    function onInstitutionChange(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            institution: newValue?.target?.value ?? '',
        }));
    }

    return (
        <div className='register-steps'>
            {/* Seção Endereço */}
            <div className='register-steps__section-title'>
                <LocationOnIcon position='start'>
                    <HomeIcon />
                </LocationOnIcon>
                <span>Endereço e Experiência</span>
            </div>

            <div className='register-steps__grid'>
                <div className='register-steps__field register-steps__field--small'>
                    <p className='field-label'>CEP <span className='required'>*</span></p>
                    <Input
                        placeholder='00000-000'
                        onChange={onCepChange}
                        value={form.cep ?? ''}
                        disabled={loadingCep}
                    />
                </div>

                <div className='register-steps__field register-steps__field--large'>
                    <p className='field-label'>Endereço <span className='required'>*</span></p>
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
                    <p className='field-label'>Bairro <span className='required'>*</span></p>
                    <Input
                        placeholder='Ex: Bela Vista'
                        onChange={onNeighbourhoodChange}
                        value={form.neighbourhood ?? ''}
                    />
                </div>

                <div className='register-steps__field'>
                    <p className='field-label'>Cidade <span className='required'>*</span></p>
                    <Input
                        placeholder='Ex: São Paulo'
                        onChange={onCityChange}
                        value={form.city ?? ''}
                    />
                </div>

              <div className='register-steps__field'>
                  <p className='field-label'>Estado <span className='required'>*</span></p>
                  <Select
                      value={StateOptions.find((option) => option.value === form.state)}
                      placeholder="UF"
                      options={StateOptions}
                      onChange={onStateChange}
                  />
              </div>
            </div>

            <div className='register-steps__grid'>
                {/* Nível de escolaridade - ocupa a linha inteira */}
                <div className='register-steps__field register-steps__field--full'>
  <div className='register-steps__section-title'>
            <SchoolIcon />
            <span>Nível de escolaridade <span className='required'>*</span></span>
        </div>
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