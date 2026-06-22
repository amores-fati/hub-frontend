'use client';
import { Button, Loading } from '@/components/base';
import { useGetCompanyProfile } from '@/services/api/companies/queries';
import { useUpdateCompanyProfile } from '@/services/api/companies/mutations';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useEffect, useState } from 'react';
import { ContatoSection } from './components/ContatoSection';
import { DadosEmpresaSection } from './components/DadosEmpresaSection';
import { companyToForm, formToUpdatePayload } from './FormMappers';
import './index.scss';
import { EditCompanyForm } from './Types';
import { validateCompanyForm } from './Validation';

export default function CompanyPerfil() {
    const { data, isLoading } = useGetCompanyProfile();

    if (isLoading || !data) {
        return <Loading />;
    }

    return <CompanyPerfilForm initialData={data} />;
}

function CompanyPerfilForm({
    initialData,
}: {
    initialData: Parameters<typeof companyToForm>[0];
}) {
    const [form, setForm] = useState<EditCompanyForm>(() =>
        companyToForm(initialData),
    );
    const { mutate, isPending } = useUpdateCompanyProfile();

    useEffect(() => {
        setForm(companyToForm(initialData));
    }, [initialData]);

    function onSave() {
        if (!validateCompanyForm(form)) return;
        mutate(formToUpdatePayload(form));
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
                <Button onClick={onSave} disabled={isPending}>
                    <SaveOutlinedIcon fontSize='small' />
                    <span>Salvar alterações</span>
                </Button>
            </footer>
        </div>
    );
}
