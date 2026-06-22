'use client';
import { Card } from '@/components/base';
import {
    ForgotPassword,
    LoginForm,
    LoginInfoPanel,
    RegisterRoleSelector,
} from '@/components/Login';
import { AuthPayload } from '@/dtos/AuthDto';
import { UserProfileDto, UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useLoginMutation } from '@/services/auth/login/mutations';
import { useForgotPasswordMutation } from '@/services/auth/password-reset/mutations';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';
import { removeStoreAuthToken } from '@/utils/stores/auth';

export default function Login() {
    const { setAuthToken } = useAuth();
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
    const {
        mutate: requestPasswordReset,
        isPending: isRequestingPasswordReset,
    } = useForgotPasswordMutation();

    const handleClick = () => {
        setDisabled(true);
        login();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    };

    useEffect(() => {
        if (loginData && loginData.accessToken) {
            removeStoreAuthToken();
            setAuthToken(loginData.accessToken, rememberMe);
            toast.success('Login realizado com sucesso!');
            const decoded = jwtDecode<UserProfileDto>(loginData.accessToken);
            const destination =
                decoded.role === UserRole.STUDENT ? '/aluno/cursos' : '/';
            router.push(destination);
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
        const email = form.email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Informe um e-mail válido.');
            return;
        }

        requestPasswordReset(
            { email },
            {
                onSuccess: () => {
                    setView('login');
                },
            },
        );
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
                                    disabled={isRequestingPasswordReset}
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
