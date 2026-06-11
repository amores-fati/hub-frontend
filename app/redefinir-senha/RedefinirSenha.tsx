'use client';

import { Card } from '@/components/base';
import { LoginInfoPanel, ResetPassword } from '@/components/Login';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './index.scss';

export default function RedefinirSenha() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
                                onBackToLogin={() => router.push('/login')}
                                onSubmit={(payload) => {
                                    // Mock da subtask 5.1, substituir pela chamada real da API
                                    // eslint-disable-next-line no-console
                                    console.log(payload);
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
