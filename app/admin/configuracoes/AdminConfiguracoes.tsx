'use client';

import { Input } from '@/components/base';
import { ButtonComponent } from '@/components/base/Button/button';
import { useGetPublicSetting, useUpdateSetting } from '@/services/api/settings';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './index.scss';

export default function AdminConfiguracoes() {
    const { data: whatsappSetting, isLoading: isLoadingSetting } = useGetPublicSetting('whatsapp_phone');
    const updateSetting = useUpdateSetting();
    
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (whatsappSetting?.value) {
            setWhatsappNumber(whatsappSetting.value);
        }
    }, [whatsappSetting]);

    const handleSave = () => {
        if (!whatsappNumber.trim()) {
            toast.error('O número do WhatsApp é obrigatório');
            return;
        }

        setIsSaving(true);
        updateSetting.mutate(
            { key: 'whatsapp_phone', value: whatsappNumber.trim() },
            {
                onSuccess: () => {
                    setIsSaving(false);
                },
                onError: () => {
                    setIsSaving(false);
                },
            }
        );
    };

    const formatWhatsAppNumber = (value: string) => {
        // Remove tudo que não é dígito
        const digits = value.replace(/\D/g, '');
        
        // Aplica a máscara: (XX) XXXXX-XXXX
        if (digits.length <= 2) {
            return digits;
        } else if (digits.length <= 7) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWhatsAppNumber(e.target.value);
        setWhatsappNumber(formatted);
    };

    if (isLoadingSetting) {
        return (
            <div className='admin-configuracoes admin-configuracoes--loading'>
                <p>Carregando configurações...</p>
            </div>
        );
    }

    return (
        <div className='admin-configuracoes'>
            <div className='admin-configuracoes__header'>
                <div className='admin-configuracoes__title'>
                    <SettingsIcon className='admin-configuracoes__icon' />
                    <h1>Configurações do Sistema</h1>
                </div>
                <p className='admin-configuracoes__subtitle'>
                    Gerencie as configurações globais da plataforma
                </p>
            </div>

            <div className='admin-configuracoes__content'>
                <div className='admin-configuracoes__card'>
                    <div className='admin-configuracoes__card-header'>
                        <WhatsAppIcon className='admin-configuracoes__card-icon' />
                        <h2>Número de WhatsApp do Suporte</h2>
                    </div>
                    
                    <p className='admin-configuracoes__description'>
                        Este número será usado em todos os botões de "Chamar no WhatsApp" 
                        espalhados pelo sistema para que alunos e empresas possam entrar em 
                        contato com o instituto.
                    </p>

                    <div className='admin-configuracoes__form'>
                        <div className='admin-configuracoes__field'>
                            <label className='admin-configuracoes__label'>
                                Número do WhatsApp
                            </label>
                            <div className='admin-configuracoes__input-wrapper'>
                                <Input
                                    type='text'
                                    value={whatsappNumber}
                                    onChange={handleChange}
                                    placeholder='(00) 00000-0000'
                                />
                            </div>
                            <p className='admin-configuracoes__hint'>
                                Formato: (DD) NNNNN-NNNN
                            </p>
                        </div>

                        {whatsappNumber && (
                            <div className='admin-configuracoes__preview'>
                                <p className='admin-configuracoes__preview-label'>
                                    Preview do link:
                                </p>
                                <a
                                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='admin-configuracoes__preview-link'
                                >
                                    {`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                                </a>
                            </div>
                        )}

                        <div className='admin-configuracoes__actions'>
                            <ButtonComponent
                                variant='primary'
                                onClick={handleSave}
                                disabled={isSaving || updateSetting.isPending}
                            >
                                {isSaving || updateSetting.isPending ? 'Salvando...' : 'Salvar Configurações'}
                            </ButtonComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
