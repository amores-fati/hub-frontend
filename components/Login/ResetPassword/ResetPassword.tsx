import { Button, Input } from '@/components/base';
import { ResetPasswordPayload } from '@/dtos/AuthDto';
import { CardActions, CardContent } from '@mui/material';
import { ChangeEventHandler, useMemo, useState } from 'react';
import './index.scss';

type ResetPasswordProps = {
    token: string;
    onBackToLogin: () => void;
    onSubmit: (payload: ResetPasswordPayload) => void;
};

type TouchedFields = {
    newPassword: boolean;
    passwordConfirmation: boolean;
};

const MIN_PASSWORD_LENGTH = 8;

export function ResetPassword({
    token,
    onBackToLogin,
    onSubmit,
}: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState<string>('');
    const [touched, setTouched] = useState<TouchedFields>({
        newPassword: false,
        passwordConfirmation: false,
    });

    const isPasswordValid = newPassword.length >= MIN_PASSWORD_LENGTH;
    const isConfirmationValid =
        passwordConfirmation.length > 0 && passwordConfirmation === newPassword;
    const canSubmit = isPasswordValid && isConfirmationValid;

    const newPasswordError = useMemo(() => {
        if (!touched.newPassword || isPasswordValid) return '';
        return 'Mínimo 8 caracteres';
    }, [isPasswordValid, touched.newPassword]);

    const confirmationError = useMemo(() => {
        if (!touched.passwordConfirmation || isConfirmationValid) return '';
        return 'As senhas não coincidem';
    }, [isConfirmationValid, touched.passwordConfirmation]);

    const onNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewPassword(e.target.value);
    };

    const onPasswordConfirmationChange: ChangeEventHandler<HTMLInputElement> = (
        e,
    ) => {
        setPasswordConfirmation(e.target.value);
    };

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSubmit({ token, newPassword });
    };

    if (!token) {
        return (
            <>
                <CardContent className='reset-password__card-content'>
                    <div className='reset-password__invalid'>
                        <h1 className='reset-password__title'>Link inválido</h1>
                        <p className='reset-password__description'>
                            Solicite um novo link de redefinição para continuar.
                        </p>
                    </div>
                </CardContent>

                <CardActions className='reset-password__card-actions'>
                    <div className='reset-password__submit-btn'>
                        <Button onClick={onBackToLogin} variant='primary'>
                            <span className='reset-password__button-text'>
                                Voltar ao login
                            </span>
                        </Button>
                    </div>
                </CardActions>
            </>
        );
    }

    return (
        <>
            <CardContent className='reset-password__card-content'>
                <div className='reset-password__content'>
                    <h1 className='reset-password__title'>
                        Definir nova senha:
                    </h1>

                    <div className='reset-password__field'>
                        <label className='reset-password__label'>
                            Nova senha:
                        </label>
                        <Input
                            value={newPassword}
                            onChange={onNewPasswordChange}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    newPassword: true,
                                }))
                            }
                            placeholder='Mínimo 8 caracteres'
                            type='password'
                            error={!!newPasswordError}
                        />
                        {newPasswordError && (
                            <span className='reset-password__error'>
                                {newPasswordError}
                            </span>
                        )}
                    </div>

                    <div className='reset-password__field'>
                        <label className='reset-password__label'>
                            Confirmação de senha:
                        </label>
                        <Input
                            value={passwordConfirmation}
                            onChange={onPasswordConfirmationChange}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    passwordConfirmation: true,
                                }))
                            }
                            placeholder='As senhas devem ser as mesmas'
                            type='password'
                            error={!!confirmationError}
                        />
                        {confirmationError && (
                            <span className='reset-password__error'>
                                {confirmationError}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardActions className='reset-password__card-actions'>
                <div className='reset-password__submit-btn'>
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        variant='primary'
                    >
                        <span className='reset-password__button-text'>
                            DEFINIR
                        </span>
                    </Button>
                </div>
            </CardActions>
        </>
    );
}
