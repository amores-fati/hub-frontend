import { Input } from '@/components/base';
import { useGetPublicCep } from '@/services/api-external/cep/queries';
import { phoneNumberRegex } from '@/utils/regex';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { EditCompanyForm, EditCompanyFormSetter } from '../Types';
import { SectionCard } from './SectionCard';

type Props = {
    form: EditCompanyForm;
    setForm: EditCompanyFormSetter;
};

export function ContatoSection({ form, setForm }: Props) {
    const [cepLookup, setCepLookup] = useState<string | null>(null);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const { data: cepData, isLoading: loadingCep } = useGetPublicCep(cepLookup);

    useEffect(() => {
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (!cepData) return;
        if (cepData.erro === 'true') {
            toast.error('CEP inválido');
            return;
        }
        setForm((prev) => ({
            ...prev,
            address: cepData.logradouro || prev.address,
            neighbourhood: cepData.bairro || prev.neighbourhood,
            city: cepData.localidade || prev.city,
            state: cepData.uf || prev.state,
        }));
    }, [cepData, setForm]);

    function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            phone: phoneNumberRegex(e.target.value) ?? '',
        }));
    }

    function onCepChange(e: ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
        setForm((prev) => ({ ...prev, cep: raw }));

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        if (raw.length < 8) {
            setForm((prev) => ({
                ...prev,
                address: '',
                neighbourhood: '',
                city: '',
                state: '',
            }));
            setCepLookup(null);
            return;
        }

        typingTimeout.current = setTimeout(() => setCepLookup(raw), 400);
    }

    function onAddressChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, address: e.target.value }));
    }

    function onComplementChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, complement: e.target.value }));
    }

    function onNeighbourhoodChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, neighbourhood: e.target.value }));
    }

    function onCityChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, city: e.target.value }));
    }

    function onStateChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            state: e.target.value.toUpperCase().slice(0, 2),
        }));
    }

    function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, email: e.target.value }));
    }

    return (
        <SectionCard icon={<LocationOnIcon />} title='Contato'>
            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>Telefone</label>
                    <Input
                        placeholder='(00) 00000-0000'
                        value={form.phone}
                        onChange={onPhoneChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>CEP</label>
                    <Input
                        placeholder='00000000'
                        value={form.cep}
                        onChange={onCepChange}
                        disabled={loadingCep}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Endereço</label>
                    <Input
                        placeholder='Ex: Av. Brasil, 456'
                        value={form.address}
                        onChange={onAddressChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Complemento</label>
                    <Input
                        placeholder='Ex: Apto 201'
                        value={form.complement}
                        onChange={onComplementChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Bairro</label>
                    <Input
                        placeholder='Ex: Centro'
                        value={form.neighbourhood}
                        onChange={onNeighbourhoodChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Cidade</label>
                    <Input
                        placeholder='Ex: Porto Alegre'
                        value={form.city}
                        onChange={onCityChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Estado</label>
                    <Input
                        placeholder='UF'
                        value={form.state}
                        onChange={onStateChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>E-mail</label>
                    <Input
                        placeholder='contato@empresa.com.br'
                        value={form.email}
                        onChange={onEmailChange}
                    />
                </div>
            </div>
        </SectionCard>
    );
}