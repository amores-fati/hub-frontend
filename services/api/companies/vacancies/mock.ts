import {
    CreateOrUpdateVacancyDto,
    VacanciesQueryParams,
    VacanciesResponseDto,
    VacancyDto,
    WorkplaceType,
} from '@/dtos/VacancyDto';

const wait = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replaceAll(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();

let mockVacancies: VacancyDto[] = [
    {
        id: 'mock-id-1',
        title: 'Estagiário Frontend - Python',
        vacancyCount: 2,
        isPcd: true,
        announcementDate: '2026-04-23',
        workplaceType: WorkplaceType.PRESENTIAL,
        description: 'Vaga para estagiário frontend com foco em Python.',
        link: 'https://example.com/vagas/1',
        skills: ['Python', 'HTML', 'CSS'],
    },
    {
        id: 'mock-id-2',
        title: 'Desenvolvedor Backend - Java',
        vacancyCount: 6,
        isPcd: true,
        announcementDate: '2026-06-30',
        workplaceType: WorkplaceType.ONLINE,
        description: 'Vaga para desenvolvedor backend com experiência em Java.',
        link: 'https://example.com/vagas/2',
        skills: ['Java', 'Spring Boot', 'SQL'],
    },
    {
        id: 'mock-id-3',
        title: 'Estagiário UX',
        vacancyCount: 5,
        isPcd: false,
        announcementDate: '2026-04-23',
        workplaceType: WorkplaceType.HYBRID,
        description: 'Vaga para estagiário de UX Design.',
        link: 'https://example.com/vagas/3',
        skills: ['Figma', 'UX Research'],
    },
    {
        id: 'mock-id-4',
        title: 'Desenvolvimento FullStack',
        vacancyCount: 10,
        isPcd: false,
        announcementDate: '2026-04-23',
        workplaceType: WorkplaceType.PRESENTIAL,
        description: 'Vaga para desenvolvedor fullstack.',
        link: 'https://example.com/vagas/4',
        skills: ['React', 'Node.js', 'TypeScript'],
    },
    {
        id: 'mock-id-5',
        title: 'Estagiário QA',
        vacancyCount: 12,
        isPcd: false,
        announcementDate: '2026-07-15',
        workplaceType: WorkplaceType.ONLINE,
        description: 'Vaga para estagiário de QA.',
        link: 'https://example.com/vagas/5',
        skills: ['Selenium', 'Cypress', 'Jest'],
    },
    {
        id: 'mock-id-6',
        title: 'Analista de Dados',
        vacancyCount: 3,
        isPcd: true,
        announcementDate: '2026-05-10',
        workplaceType: WorkplaceType.HYBRID,
        description: 'Vaga para analista de dados.',
        link: 'https://example.com/vagas/6',
        skills: ['Python', 'SQL', 'Power BI'],
    },
    {
        id: 'mock-id-7',
        title: 'DevOps Engineer',
        vacancyCount: 2,
        isPcd: false,
        announcementDate: '2026-05-20',
        workplaceType: WorkplaceType.ONLINE,
        description: 'Vaga para engenheiro DevOps.',
        link: 'https://example.com/vagas/7',
        skills: ['Docker', 'Kubernetes', 'CI/CD'],
    },
    {
        id: 'mock-id-8',
        title: 'Desenvolvedor Mobile iOS',
        vacancyCount: 4,
        isPcd: false,
        announcementDate: '2026-06-01',
        workplaceType: WorkplaceType.PRESENTIAL,
        description: 'Vaga para desenvolvedor mobile iOS.',
        link: 'https://example.com/vagas/8',
        skills: ['Swift', 'Objective-C', 'Xcode'],
    },
    {
        id: 'mock-id-9',
        title: 'Scrum Master',
        vacancyCount: 1,
        isPcd: true,
        announcementDate: '2026-05-05',
        workplaceType: WorkplaceType.HYBRID,
        description: 'Vaga para Scrum Master.',
        link: 'https://example.com/vagas/9',
        skills: ['Scrum', 'Kanban', 'Jira'],
    },
    {
        id: 'mock-id-10',
        title: 'Designer Gráfico',
        vacancyCount: 7,
        isPcd: false,
        announcementDate: '2026-07-01',
        workplaceType: WorkplaceType.ONLINE,
        description: 'Vaga para designer gráfico.',
        link: 'https://example.com/vagas/10',
        skills: ['Figma', 'Illustrator', 'Photoshop'],
    },
];

let nextId = 11;

const filterVacancies = (
    vacancies: VacancyDto[],
    params: VacanciesQueryParams,
): VacancyDto[] => {
    const search = normalize(params.search ?? '');
    const workplaceTypes = new Set(params.workplaceTypes ?? []);

    return vacancies.filter((vacancy) => {
        const matchesSearch =
            !search ||
            normalize(vacancy.title).includes(search) ||
            String(vacancy.vacancyCount).includes(search);

        const matchesPcd =
            params.isPcd === undefined || vacancy.isPcd === params.isPcd;

        const matchesWorkplace =
            workplaceTypes.size === 0 ||
            (vacancy.workplaceType !== undefined &&
                workplaceTypes.has(vacancy.workplaceType));

        return matchesSearch && matchesPcd && matchesWorkplace;
    });
};

export const getCompanyVacanciesMock = async (
    params: VacanciesQueryParams,
): Promise<VacanciesResponseDto> => {
    await wait(400);

    const page = params.page ?? 1;
    const limit = params.limit ?? 5;
    const filtered = filterVacancies(mockVacancies, params);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        data: filtered.slice(start, end),
        total: filtered.length,
        page,
        limit,
    };
};

export const createVacancyMock = async (
    payload: CreateOrUpdateVacancyDto,
): Promise<VacancyDto> => {
    await wait(300);

    const newVacancy: VacancyDto = {
        id: `mock-id-${nextId++}`,
        title: payload.title,
        vacancyCount: payload.vacancyCount,
        isPcd: payload.isPcd,
        announcementDate: new Date().toISOString().split('T')[0] ?? '',
        workplaceType: payload.workplaceType,
        description: payload.description,
        link: payload.link,
        skills: payload.skills ?? [],
    };

    mockVacancies = [newVacancy, ...mockVacancies];

    return newVacancy;
};

export const updateVacancyMock = async (
    id: string,
    payload: CreateOrUpdateVacancyDto,
): Promise<VacancyDto> => {
    await wait(300);

    const index = mockVacancies.findIndex((v) => v.id === id);

    if (index === -1) {
        const error = new Error('NOT_FOUND');
        error.name = 'NOT_FOUND';
        throw error;
    }

    const updated: VacancyDto = {
        ...mockVacancies[index]!,
        title: payload.title,
        vacancyCount: payload.vacancyCount,
        isPcd: payload.isPcd,
        workplaceType: payload.workplaceType,
        description: payload.description,
        link: payload.link,
        skills: payload.skills ?? [],
    };

    mockVacancies = mockVacancies.map((v) => (v.id === id ? updated : v));

    return updated;
};

export const deleteVacancyMock = async (id: string): Promise<void> => {
    await wait(250);

    if (!mockVacancies.some((v) => v.id === id)) {
        const error = new Error('NOT_FOUND');
        error.name = 'NOT_FOUND';
        throw error;
    }

    mockVacancies = mockVacancies.filter((v) => v.id !== id);
};
