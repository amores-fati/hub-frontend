'use client';
import LogoSvg from '@/assets/logo.svg';
import { Button, Card, Checkbox, Input } from '@/components/base';
import { FeatureCard } from '@/components/FeatureCard';
import { AuthPayload } from '@/dtos/AuthDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useLoginMutation } from '@/services/auth/login/mutations';
import { CardActions, CardContent } from '@mui/material';
import Image from 'next/image';
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

    return (
        <div className='login-page'>
            <div className='login-page__left'>
                <div className='login-page__header'>
                    <div className='login-page__header-text'>
                        <h2 className='login-page__header-title'>
                            <span className='login-page__header-title-line'>
                                Feito para
                            </span>
                            <span className='login-page__header-title-line login-page__header-title-line--accent'>
                                todo
                            </span>
                            <span className='login-page__header-title-line'>
                                tipo de pessoa!
                            </span>
                        </h2>

                        <p className='login-page__subtitle'>
                            Esse site oferece recursos de{' '}
                            <strong>acessibilidade</strong> para que sua{' '}
                            <strong>experiência</strong> seja{' '}
                            <strong>a melhor</strong>, independente de como
                            enxerga, lê ou navega.
                        </p>
                    </div>

                    <div className='login-page__logo'>
                        <Image src={LogoSvg} alt='Hub Logo' />
                    </div>
                </div>

                <div className='login-page__features-grid'>
                    <FeatureCard
                        title='Alto Contraste'
                        subtitle='Todas as cores da interface foram pensadas para ter uma alta definição.'
                        color='var(--primary-color)'
                        badgeText='Visual'
                        badgeDarkText={true}
                    />
                    <FeatureCard
                        title='Navegação Simplificada'
                        subtitle='Menus e opções reorganizados para facilitar o acesso rápido às funções mais usadas.'
                        color='var(--secondary-color)'
                        badgeText='Navegação'
                        badgeDarkText={true}
                    />
                    <FeatureCard
                        title='Navegação por Teclado'
                        subtitle='Todos os elementos acessíveis com Tab, Enter e atalhos de teclado.'
                        color='var(--tertiary-color)'
                        badgeText='Navegação'
                        badgeDarkText={false}
                    />
                    <FeatureCard
                        title='Leitor de Tela'
                        subtitle='Compatível com NVDA, JAWS e VoiceOver, com labels e roles ARIA.'
                        color='var(--complement-3)'
                        badgeText='Auditivo'
                        badgeDarkText={false}
                    />
                </div>
            </div>
            <div className='login-page__right'>
                <div className='login-page__card'>
                    <Card>
                        <CardContent className='login-page__card-content'>
                            <div className='login-page__content'>
                                <h1 className='login-page__title'>
                                    Faça login na plataforma!
                                </h1>

                                <div className='login-page__field'>
                                    <label className='login-page__label'>
                                        Email
                                    </label>
                                    <Input
                                        value={form.email}
                                        onChange={onEmailChange}
                                        placeholder=''
                                        type='email'
                                    />
                                </div>

                                <div className='login-page__field'>
                                    <label className='login-page__label'>
                                        Senha
                                    </label>
                                    <Input
                                        value={form.password}
                                        onChange={onPasswordChange}
                                        placeholder=''
                                        type='password'
                                    />
                                </div>

                                <div className='login-page__remember'>
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                    />
                                    <span
                                        className='login-page__remember-label'
                                        onClick={() =>
                                            setRememberMe(!rememberMe)
                                        }
                                    >
                                        Manter-me conectado
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        <CardActions className='login-page__card-actions'>
                            <div className='login-page__actions'>
                                <Button
                                    onClick={handleClick}
                                    disabled={disabled}
                                    variant='primary'
                                    className='login-page__submit-btn'
                                >
                                    <span className='login-page__button-text'>
                                        ENTRAR
                                    </span>
                                </Button>

                                <div className='login-page__links'>
                                    <span
                                        className='login-page__link login-page__link--primary'
                                        onClick={() =>
                                            router.push('/cadastro/aluno')
                                        }
                                    >
                                        Quero me cadastrar!
                                    </span>
                                    <span className='login-page__link'>
                                        Esqueci minha senha
                                    </span>
                                </div>
                            </div>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </div>
    );
}
