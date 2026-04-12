import { Button, Input } from '@/components/base';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CardActions, CardContent } from '@mui/material';
import { ChangeEventHandler } from 'react';
import './index.scss';

type ForgotPasswordProps = {
    email: string;
    disabled: boolean;
    onEmailChange: ChangeEventHandler<HTMLInputElement> | undefined;
    onBack: () => void;
    onSubmit: () => void;
};

export function ForgotPassword({
    email,
    disabled,
    onEmailChange,
    onBack,
    onSubmit,
}: ForgotPasswordProps) {
    return (
        <>
            <CardContent className='login-page__card-content'>
                <div className='login-page__forgot-password'>
                    <div
                        className='login-page__forgot-password-back'
                        onClick={onBack}
                    >
                        <ArrowBackIcon />
                        <span>Voltar</span>
                    </div>

                    <h1 className='login-page__forgot-password-title'>
                        Esqueceu a senha?
                    </h1>

                    <p className='login-page__forgot-password-desc'>
                        Informe seu email para receber um link de redefinição
                    </p>

                    <div className='login-page__field login-page__forgot-password-field'>
                        <Input
                            value={email}
                            onChange={onEmailChange}
                            placeholder='meu@email.com'
                            type='email'
                            disabled={disabled}
                        />
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
                            {disabled ? 'Enviando...' : 'ENVIAR LINK'}
                        </span>
                    </Button>
                </div>
            </CardActions>
        </>
    );
}
