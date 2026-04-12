'use client';
import { Card } from '@/components/base';
import {
    ForgotPassword,
    LoginForm,
    LoginInfoPanel,
    RegisterRoleSelector,
} from '@/components/Login';
import { AuthPayload } from '@/dtos/AuthDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useLoginMutation } from '@/services/auth/login/mutations';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

export default function Login() {
    const { setAuthToken, removeAuthToken } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState<AuthPayload>({
        email: '',
        password: '',
    });
    const [disabled, setDisabled] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [view, setView] = useState<
        'login' | 'registerRole' | 'forgotPassword'
    >('login');
    const { mutate: login, data: loginData } = useLoginMutation(form);

    const handleClick = () => {
        setDisabled(true);
        login();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    };

    useEffect(() => {
        if (loginData && loginData.accessToken) {
            removeAuthToken();
            setAuthToken(loginData.accessToken, rememberMe);
            toast.success('Login realizado com sucesso!');
            router.push('/');
        }
    }, [loginData]);

    const onEmailChange: ChangeEventHandler<HTMLInputElement> | undefined = (
        e,
    ) => {
        setForm((prev) => ({
            ...prev,
            email: e.target.value,
        }));
    };

    const onPasswordChange: ChangeEventHandler<HTMLInputElement> | undefined = (
        e,
    ) => {
        setForm((prev) => ({
            ...prev,
            password: e.target.value,
        }));
    };

    const handleForgotPasswordSubmit = () => {
        setDisabled(true);
        // mock do envio do email de recuperação
        setTimeout(() => {
            setDisabled(false);
            toast.success('Link de redefinição enviado com sucesso!');
            setView('login');
        }, 1000);
    };

    return (
        <div className='login-page'>
            <LoginInfoPanel />
            <div className='login-page__right'>
                <div className='login-page__card'>
                    <Card>
                        <div className='login-page__card-wrapper'>
                            {view === 'registerRole' && (
                                <RegisterRoleSelector
                                    onBack={() => setView('login')}
                                    onSelectStudent={() =>
                                        router.push('/cadastro/aluno')
                                    }
                                    onSelectCompany={() =>
                                        router.push('/cadastro/empresa')
                                    }
                                />
                            )}
                            {view === 'forgotPassword' && (
                                <ForgotPassword
                                    email={form.email}
                                    disabled={disabled}
                                    onEmailChange={onEmailChange}
                                    onBack={() => setView('login')}
                                    onSubmit={handleForgotPasswordSubmit}
                                />
                            )}
                            {view === 'login' && (
                                <LoginForm
                                    form={form}
                                    disabled={disabled}
                                    rememberMe={rememberMe}
                                    onEmailChange={onEmailChange}
                                    onPasswordChange={onPasswordChange}
                                    onRememberMeChange={setRememberMe}
                                    onSubmit={handleClick}
                                    onGoToRegister={() =>
                                        setView('registerRole')
                                    }
                                    onGoToForgotPassword={() =>
                                        setView('forgotPassword')
                                    }
                                />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
