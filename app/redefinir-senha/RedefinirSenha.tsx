'use client';

import { Card } from '@/components/base';
import { LoginInfoPanel, ResetPassword } from '@/components/Login';
import { useResetPasswordMutation } from '@/services/auth/password-reset/mutations';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './index.scss';

export default function RedefinirSenha() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: resetPassword, isPending: isResettingPassword } =
        useResetPasswordMutation();
    const initialToken = searchParams.get('token') ?? '';
    const [token, setToken] = useState<string>(initialToken);

    useEffect(() => {
        setToken(searchParams.get('token') ?? '');
    }, [searchParams]);

    return (
        <div className='reset-password-page'>
            <LoginInfoPanel />
            <div className='reset-password-page__right'>
                <div className='reset-password-page__card'>
                    <Card>
                        <div className='reset-password-page__card-wrapper'>
                            <ResetPassword
                                token={token}
                                disabled={isResettingPassword}
                                onBackToLogin={() => router.push('/login')}
                                onSubmit={(payload) => {
                                    resetPassword(payload, {
                                        onSuccess: () => {
                                            router.push('/login');
                                        },
                                    });
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
