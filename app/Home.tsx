'use client';

import { AdminDashboard } from '@/components/AdminDashboard';
import { Loading } from '@/components/base';
import { UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useGetAdminDashboard } from '@/services/api/admin/dashboard/queries';
import './home.scss';

type HomeFallbackProps = {
    description: string;
    tag: string;
    title: string;
};

function HomeFallback({ description, tag, title }: HomeFallbackProps) {
    return (
        <section className='home-page'>
            <div className='home-page__fallback'>
                <span className='home-page__fallback-tag'>{tag}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </section>
    );
}

export default function HomePage() {
    const { isHydrated, user } = useAuth();
    const role = user?.role;
    const withOutLogin = !user; //Enquanto não existe autenticação, RETIRAR QUANDO TIVER AUTENTICAÇÃO REAL
    const isAdmin = user?.role === UserRole.ADMIN;
    const shouldRenderAdminHome = isHydrated && (withOutLogin || isAdmin);
    const {
        data: dashboardData,
        isLoading,
        isFetching,
        isError,
    } = useGetAdminDashboard(shouldRenderAdminHome);

    if (!isHydrated) {
        return (
            <section className='home-page home-page--centered'>
                <Loading className='home-page__loading' />
            </section>
        );
    }

    if (shouldRenderAdminHome && (isLoading || isFetching) && !dashboardData) {
        return (
            <section className='home-page home-page--centered'>
                <Loading className='home-page__loading' />
            </section>
        );
    }

    if (shouldRenderAdminHome && isError) {
        return (
            <HomeFallback
                tag='Erro ao carregar'
                title='Não foi possível obter o dashboard agora'
                description='A estrutura de integração já está pronta. Quando o backend estiver disponível, essa tela vai consumir o endpoint real automaticamente.'
            />
        );
    }

    if (shouldRenderAdminHome && dashboardData) {
        return (
            <section className='home-page'>
                <AdminDashboard data={dashboardData} />
            </section>
        );
    }

    if (role === UserRole.STUDENT) {
        return (
            <HomeFallback
                tag='Área do aluno'
                title='Bem-vindo à plataforma'
                description='A home do aluno será exibida aqui. Por enquanto, esta área permanece como placeholder até a próxima etapa de implementação.'
            />
        );
    }

    if (role === UserRole.COMPANY) {
        return (
            <HomeFallback
                tag='Área da empresa'
                title='Bem-vindo à plataforma'
                description='A home da empresa será exibida aqui. Por enquanto, esta área permanece como placeholder até a próxima etapa de implementação.'
            />
        );
    }

    return (
        <HomeFallback
            tag='Área inicial'
            title='Bem-vindo à plataforma'
            description='A rota principal já está preparada para renderizar homes diferentes por perfil.'
        />
    );
}
