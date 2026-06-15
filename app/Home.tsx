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
    useGetStudentCountByMonth,
} from '../services/api/admin/dashboard/queries';
import { CompanyVacancies } from './empresa/vagas/CompanyVacancies';

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
    const {
        data: countByMonthData,
        isLoading: isCountByMonthLoading,
        isError: isCountByMonthError,
    } = useGetStudentCountByMonth();

    if (
        isDashboardLoading ||
        isDisabilityLoading ||
        isStudentCountLoading ||
        isCountByMonthLoading
    )
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

    const isAnyDashboardQueryLoading =
        isDashboardLoading ||
        isDisabilityLoading ||
        isStudentCountLoading ||
        isCountByMonthLoading;
    const isAnyDashboardDataMissing =
        !dashboardData || !disabilityData || !countByCityData;

    if (
        shouldRenderAdminHome &&
        isAnyDashboardQueryLoading &&
        isAnyDashboardDataMissing
    ) {
        return (
            <section className='home-page home-page--centered'>
                <Loading className='home-page__loading' />
            </section>
        );
    }

    if (
        shouldRenderAdminHome &&
        (isDashboardError ||
            isDisabilityError ||
            isStudentCountError ||
            isCountByMonthError)
    ) {
        return (
            <HomeFallback
                tag='Erro ao carregar'
                title='Não foi possível obter o dashboard agora'
                description='A estrutura de integração já está pronta. Quando o backend estiver disponível, essa tela vai consumir o endpoint real automaticamente.'
            />
        );
    }

    if (
        shouldRenderAdminHome &&
        dashboardData &&
        disabilityData &&
        countByCityData
    ) {
        return (
            <section className='home-page'>
                <AdminDashboard
                    data={{
                        stats: dashboardData,
                        disabilityDistribution: disabilityData,
                        studentsByCity: countByCityData,
                        enrollmentsByMonth: countByMonthData ?? [],
                        impactTimeline: [],
                    }}
                />
            </section>
        );
    }

    if (role === UserRole.COMPANY) {
        return (
            <CompanyVacancies />
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
