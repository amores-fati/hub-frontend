import { Button, Checkbox, Input } from '@/components/base';
import { AuthPayload } from '@/dtos/AuthDto';
import { CardActions, CardContent } from '@mui/material';
import { ChangeEventHandler } from 'react';
import './index.scss';

type LoginFormProps = {
    form: AuthPayload;
    disabled: boolean;
    rememberMe: boolean;
    onEmailChange: ChangeEventHandler<HTMLInputElement> | undefined;
    onPasswordChange: ChangeEventHandler<HTMLInputElement> | undefined;
    onRememberMeChange: (checked: boolean) => void;
    onSubmit: () => void;
    onGoToRegister: () => void;
    onGoToForgotPassword: () => void;
};

export function LoginForm({
    form,
    disabled,
    rememberMe,
    onEmailChange,
    onPasswordChange,
    onRememberMeChange,
    onSubmit,
    onGoToRegister,
    onGoToForgotPassword,
}: LoginFormProps) {
    return (
        <>
            <CardContent className='login-page__card-content'>
                <div className='login-page__content'>
                    <h1 className='login-page__title'>
                        Faça login na plataforma!
                    </h1>

                    <div className='login-page__field'>
                        <label className='login-page__label'>Email</label>
                        <Input
                            value={form.email}
                            onChange={onEmailChange}
                            placeholder=''
                            type='email'
                            disabled={disabled}
                        />
                    </div>

                    <div className='login-page__field'>
                        <label className='login-page__label'>Senha</label>
                        <Input
                            value={form.password}
                            onChange={onPasswordChange}
                            placeholder=''
                            type='password'
                            disabled={disabled}
                        />
                    </div>

                    <div className='login-page__remember'>
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) =>
                                !disabled &&
                                onRememberMeChange(e.target.checked)
                            }
                        />
                        <span
                            className='login-page__remember-label'
                            onClick={() =>
                                !disabled && onRememberMeChange(!rememberMe)
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
                        onClick={onSubmit}
                        disabled={disabled}
                        variant='primary'
                        className='login-page__submit-btn'
                    >
                        <span className='login-page__button-text'>
                            {disabled ? 'Entrando...' : 'ENTRAR'}
                        </span>
                    </Button>

                    <div className='login-page__links'>
                        <span
                            className='login-page__link login-page__link--primary'
                            onClick={onGoToRegister}
                        >
                            Quero me cadastrar!
                        </span>
                        <span
                            className='login-page__link'
                            onClick={onGoToForgotPassword}
                        >
                            Esqueci minha senha
                        </span>
                    </div>
                </div>
            </CardActions>
        </>
    );
}
