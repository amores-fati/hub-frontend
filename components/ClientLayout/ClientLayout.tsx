'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserRole } from '../../dtos/UserDto';
import { useAuth } from '../../providers/Auth/AuthProvider';
import { useRoute } from '../../providers/Route/RouteProvider';
import './index.scss';

import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { P401, P403 } from './Placeholders';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { currentPage } = useRoute();

    useEffect(() => {
        if (currentPage?.requireAuth && !user) {
            toast.warning(
                'Você precisa estar logado para acessar essa página.',
            );
            logout();
        }
    }, [currentPage]);

    // Redirecionar para o login se a página exigir autenticação e o usuário não estiver logado
    if (!user && currentPage?.requireAuth) {
        return <P401 />;
    }

    if (
        currentPage?.requireRoles.length &&
        !currentPage?.requireRoles.includes(user?.role as UserRole)
    ) {
        return (
            <P403
                resourceName={currentPage.name}
                onGoBack={() => router.back()}
            />
        );
    }

    return (
        <div className='layout-container'>
            <div className='w-full'>
                {currentPage?.navbarEnabled && <Navbar />}
                <main className='w-full'>{children}</main>
            </div>
        </div>
    );
}
