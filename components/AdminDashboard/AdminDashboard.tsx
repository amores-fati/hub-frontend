'use client';
import { AdminDashboardDto } from '@/dtos/AdminDashboardDto';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import { CourseCapacityList } from './CourseCapacityList';
import { EnrollmentChart } from './EnrollmentChart';
import { ImpactTimeline } from './ImpactTimeline';
import { StatCard } from './StatCard';
import { StatusDonutChart } from './StatusDonutChart';
import { StatCardItem } from './Types';
import './index.scss';
type AdminDashboardProps = { data: AdminDashboardDto };
export function AdminDashboard({ data }: AdminDashboardProps) {
    const stats: StatCardItem[] = [
        {
            key: 'totalStudents',
            label: 'Total de alunos',
            value: data.stats.totalStudents,
            icon: <PersonRoundedIcon />,
            accentClassName: 'admin-stat-card--primary',
            helperText: 'Base cadastrada',
        },
        {
            key: 'totalPcd',
            label: 'Alunos PCD',
            value: data.stats.totalPcd,
            icon: <Diversity3RoundedIcon />,
            accentClassName: 'admin-stat-card--tertiary',
            helperText: 'Inclusão ativa',
        },
        {
            key: 'totalActiveVacancies',
            label: 'Vagas ativas',
            value: data.stats.totalActiveVacancies,
            icon: <WorkOutlineRoundedIcon />,
            accentClassName: 'admin-stat-card--neutral',
            helperText: 'Oportunidades abertas',
        },
    ];
    return (
        <div className='admin-dashboard'>
            {' '}
            <section className='admin-dashboard__hero'>
                {' '}
                <div>
                    {' '}
                    <span className='admin-dashboard__eyebrow'>
                        Painel administrativo
                    </span>{' '}
                    <h1>Bem-vindo ao Sistema Amores Fati!</h1>{' '}
                </div>{' '}
            </section>{' '}
            <section className='admin-dashboard__stats-grid'>
                {' '}
                {stats.map((item) => (
                    <StatCard key={item.key} item={item} />
                ))}{' '}
            </section>{' '}
            <section className='admin-dashboard__grid admin-dashboard__grid--two-columns'>
                {' '}
                <EnrollmentChart data={data.enrollmentsByMonth} />{' '}
                <StatusDonutChart data={data.disabilityDistribution} />{' '}
            </section>{' '}
            <section className='admin-dashboard__grid admin-dashboard__grid--two-columns'>
                {' '}
                <CourseCapacityList data={data.studentsByCity} />{' '}
                <ImpactTimeline data={data.impactTimeline} />{' '}
            </section>{' '}
        </div>
    );
}
