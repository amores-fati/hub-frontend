'use client';
import { Button } from '@/components/base';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useState } from 'react';
import { ContatoSection } from './components/ContatoSection';
import { DadosEmpresaSection } from './components/DadosEmpresaSection';
import { MOCK_COMPANY } from './mock';
import './index.scss';
import { EditCompanyForm } from './Types';
import { validateCompanyForm } from './Validation';

export default function CompanyPerfil() {
    const [form, setForm] = useState<EditCompanyForm>(MOCK_COMPANY);

    function onSave() {
        if (!validateCompanyForm(form)) return;

        console.log('Payload que será enviado:', form);
    }

    return (
        <div className='perfil-empresa-page'>
            <header className='perfil-empresa-page__header'>
                <h1 className='perfil-empresa-page__title'>Perfil Empresa</h1>
                <p className='perfil-empresa-page__subtitle'>
                    Gerencie as <strong>informações da sua empresa</strong> e
                    dados de <strong>contato</strong>.
                </p>
            </header>

            <div className='perfil-empresa-page__sections'>
                <DadosEmpresaSection form={form} />
                <ContatoSection form={form} setForm={setForm} />
            </div>

            <footer className='perfil-empresa-page__footer'>
                <Button onClick={onSave}>
                    <SaveOutlinedIcon fontSize='small' />
                    <span>Salvar alterações</span>
                </Button>
            </footer>
        </div>
    );
}