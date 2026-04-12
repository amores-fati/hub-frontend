import { AdminDashboardDto } from '@/dtos/AdminDashboardDto';

export const adminDashboardMock: AdminDashboardDto = {
    stats: {
        totalStudents: 152,
        totalPcd: 128,
        totalActiveVacancies: 23,
    },
    enrollmentsByMonth: [
        { month: '2024-03', count: 8 },
        { month: '2024-04', count: 14 },
        { month: '2024-05', count: 11 },
        { month: '2024-06', count: 19 },
        { month: '2024-07', count: 22 },
        { month: '2024-08', count: 17 },
        { month: '2024-09', count: 25 },
        { month: '2024-10', count: 30 },
        { month: '2024-11', count: 21 },
        { month: '2024-12', count: 18 },
        { month: '2025-01', count: 28 },
        { month: '2025-02', count: 33 },
    ],
    disabilityDistribution: [
        { disabilityType: 'Física', count: 34 },
        { disabilityType: 'Auditiva', count: 21 },
        { disabilityType: 'Visual', count: 18 },
        { disabilityType: 'Intelectual', count: 29 },
        { disabilityType: 'Psicossocial', count: 11 },
        { disabilityType: 'Múltipla', count: 9 },
        { disabilityType: 'Outra', count: 6 },
    ],
    studentsByCity: [
        {
            city: 'Porto Alegre',
            state: 'RS',
            count: 46,
        },
        {
            city: 'Canoas',
            state: 'RS',
            count: 33,
        },
        {
            city: 'São Borja',
            state: 'RS',
            count: 24,
        },
        {
            city: 'Florianópolis',
            state: 'SC',
            count: 19,
        },
        {
            city: 'Chapecó',
            state: 'SC',
            count: 15,
        },
        {
            city: 'Xanxerê',
            state: 'SC',
            count: 9,
        },
    ],
    impactTimeline: [
        {
            date: '2025-02-10',
            type: 'placement',
            description:
                'Ana Souza foi encaminhada para a TechBR como Desenvolvedora Frontend',
        },
        {
            date: '2025-01-15',
            type: 'course_launch',
            description: 'Novo curso de Analise de Dados lancado com 40 vagas',
        },
        {
            date: '2024-12-01',
            type: 'partnership',
            description: 'Nova parceria firmada com a empresa DataPeople',
        },
    ],
};

export const getAdminDashboardMock = async (): Promise<AdminDashboardDto> => {
    await new Promise((resolve) => {
        setTimeout(resolve, 600);
    });

    return adminDashboardMock;
};
