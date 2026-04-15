'use client';
import { CardActions, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';

import { Button } from '@/components/base';
import Card from '@/components/base/Card/card';
import { CompanyRegisterPayload } from '@/dtos/CompanyDto';
import { Form, validateForm } from './Form';
import './index.scss';
import { useCompanyRegister } from '@/services/api/companies/mutations';
import { useLoginMutation } from '@/services/auth/login/mutations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { removeStoreAuthToken } from '@/utils/stores/auth';

export default function CadastroEmpresa() {
    const [form, setForm] = useState<CompanyRegisterPayload>({
        name: '',
        cnpj: '',
        phoneNumber: '',
        email: '',
        ownerName: '',
        password: '',
        passwordConfirmation: '',
        cep: '',
        address: undefined,
        complement: undefined,
        neighbourhood: undefined,
        city: undefined,
        state: undefined,
        lgpd: {
            terms: false,
        },
    });

    const router = useRouter();

    const { setAuthToken } = useAuth();

    const { mutate, error, data } = useCompanyRegister(form);
    const { mutate: login, data: loginData } = useLoginMutation({
        email: form.email ?? '',
        password: form.password ?? '',
    });

    useEffect(() => {
        if (error || !data) return;
        login();
    }, [data]);

    useEffect(() => {
        if (loginData && loginData.accessToken) {
            removeStoreAuthToken();
            setAuthToken(loginData.accessToken, true);
            toast.success('Login realizado com sucesso!');
            router.push('/');
        }
    }, [loginData]);

    const onClick = () => {
        try {
            validateForm(form);
            mutate();
        } catch {
            return null;
        }
    };

    return (
        <div className='cadastro-aluno-page w-full'>
            <div className='page-title'>
                <h1>Inclua sua empresa no</h1>
                <h1 className='page-title__highlight'>Instituto Amores Fati</h1>
            </div>

            <Card>
                <CardContent aria-label='content'>
                    <Form form={form} setForm={setForm} />
                </CardContent>
                <CardActions aria-label='actions'>
                    <Button onClick={onClick}>
                        <span>{'Cadastrar'}</span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
