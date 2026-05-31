'use client';

import { AdminDashboard } from '@/components/AdminDashboard';
import { Loading } from '@/components/base';
import { UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './home.scss';
import {
    useGetDashboardStats,
    useGetDisabilityStats,
    useGetStudentCountByCity,
} from '../services/api/admin/dashboard/queries';

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
    const router = useRouter();
    const role = user?.role;
    const withOutLogin = !user; //Enquanto não existe autenticação, RETIRAR QUANDO TIVER AUTENTICAÇÃO REAL
    const isAdmin = user?.role === UserRole.ADMIN;
    const isStudent = role === UserRole.STUDENT;
    const shouldRenderAdminHome = isHydrated && (withOutLogin || isAdmin);

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        isError: isDashboardError,
    } = useGetDashboardStats();
    const {
        data: disabilityData,
        isLoading: isDisabilityLoading,
        isError: isDisabilityError,
    } = useGetDisabilityStats();
    const {
        data: countByCityData,
        isLoading: isStudentCountLoading,
        isError: isStudentCountError,
    } = useGetStudentCountByCity();

    if (isDashboardLoading || isDisabilityLoading || isStudentCountLoading)
        <Loading />;

    useEffect(() => {
        if (isHydrated && isStudent) {
            router.replace('/aluno/cursos');
        }
    }, [isHydrated, isStudent, router]);

    if (!isHydrated || isStudent) {
        return (
            <section className='home-page home-page--centered'>
                <Loading className='home-page__loading' />
            </section>
        );
    }

    if (
        shouldRenderAdminHome &&
        (isDashboardLoading || isDisabilityLoading || isStudentCountLoading) &&
        !dashboardData
    ) {
        return (
            <section className='home-page home-page--centered'>
                <Loading className='home-page__loading' />
            </section>
        );
    }

    if (
        shouldRenderAdminHome &&
        (isDashboardError || isDisabilityError || isStudentCountError)
    ) {
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
                <AdminDashboard
                    data={{
                        stats: dashboardData!,
                        disabilityDistribution: disabilityData!,
                        studentsByCity: countByCityData!,
                        // TODO
                        enrollmentsByMonth: [],
                        impactTimeline: [],
                    }}
                />
            </section>
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
