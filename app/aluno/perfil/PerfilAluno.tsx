'use client';
import { Button, Loading } from '@/components/base';
import { useUpdateStudentProfile } from '@/services/api/students/mutations';
import { useGetStudentProfile } from '@/services/api/students/queries';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useEffect, useState } from 'react';
import { ContatoSection } from './components/ContatoSection';
import { DadosPessoaisSection } from './components/DadosPessoaisSection';
import { EscolaridadeSection } from './components/EscolaridadeSection';
import { OutrasInformacoesSection } from './components/OutrasInformacoesSection';
import { PerfilProfissionalSection } from './components/PerfilProfissionalSection';
import { formToUpdatePayload, profileToForm } from './FormMappers';
import './index.scss';
import { EditProfileForm } from './Types';
import { validateProfileForm } from './Validation';

export default function PerfilAluno() {
    const { data, isLoading } = useGetStudentProfile();

    if (isLoading || !data) {
        return <Loading />;
    }

    return <PerfilAlunoForm initialData={data} />;
}

function PerfilAlunoForm({
    initialData,
}: {
    initialData: Parameters<typeof profileToForm>[0];
}) {
    const [form, setForm] = useState<EditProfileForm>(() =>
        profileToForm(initialData),
    );
    const { mutate, isPending } = useUpdateStudentProfile();

    useEffect(() => {
        setForm(profileToForm(initialData));
    }, [initialData]);

    function onSave() {
        if (!validateProfileForm(form)) return;
        const payload = formToUpdatePayload(form, initialData.id);
        mutate(payload);
    }

    return (
        <div className='perfil-aluno-page'>
            <header className='perfil-aluno-page__header'>
                <h1 className='perfil-aluno-page__title'>Meu Perfil</h1>
                <p className='perfil-aluno-page__subtitle'>
                    Gerencie suas <strong>informações pessoais</strong> e dados
                    de <strong>contato</strong>.
                </p>
            </header>

            <div className='perfil-aluno-page__sections'>
                <DadosPessoaisSection form={form} setForm={setForm} />
                <ContatoSection form={form} setForm={setForm} />
                <EscolaridadeSection form={form} setForm={setForm} />
                <PerfilProfissionalSection form={form} setForm={setForm} />
                <OutrasInformacoesSection form={form} setForm={setForm} />
            </div>

            <footer className='perfil-aluno-page__footer'>
                <Button onClick={onSave} disabled={isPending}>
                    <SaveOutlinedIcon fontSize='small' />
                    <span>Salvar alterações</span>
                </Button>
            </footer>
        </div>
    );
}
