import { CourseDto, EnrollmentDto } from '@/dtos/CourseDto';

export const coursesMock: CourseDto[] = [
    {
        id: 'mock-id-1',
        title: 'Python para Iniciantes',
        description:
            'Aprenda os fundamentos da programação com Python, uma das linguagens mais populares e versáteis do mercado de tecnologia. O curso aborda lógica de programação, estruturas de dados, funções, e introdução a bibliotecas como Pandas e Matplotlib.',
        modality: 'online',
        workloadHours: 50,
        vacancyCount: 15,
        startDate: '2026-09-01',
        endDate: '2026-12-01',
        enrollmentStart: '2026-08-01',
        enrollmentEnd: '2026-08-31',
        location: null,
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-2',
        title: 'Marketing Digital',
        description:
            'Estratégias de Marketing para redes sociais. Aprenda a criar campanhas eficientes, analisar métricas e construir uma presença digital sólida para marcas e negócios.',
        modality: 'presencial',
        workloadHours: 40,
        vacancyCount: 10,
        startDate: '2026-10-01',
        endDate: '2027-01-01',
        enrollmentStart: '2026-09-01',
        enrollmentEnd: '2026-09-30',
        location: 'Porto Alegre - RS',
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-3',
        title: 'JavaScript Avançado',
        description:
            'Domine conceitos avançados de JS para construir aplicações modernas. Abrange closures, promises, async/await, módulos ES6+, e frameworks populares.',
        modality: 'online',
        workloadHours: 50,
        vacancyCount: 15,
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        enrollmentStart: '2024-02-01',
        enrollmentEnd: '2024-02-28',
        location: null,
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-4',
        title: 'Introdução à Análise de Dados',
        description:
            'Domine conceitos de análise de dados com ferramentas modernas. Trabalhe com planilhas, SQL, Python e visualizações para transformar dados em decisões.',
        modality: 'online',
        workloadHours: 60,
        vacancyCount: 25,
        startDate: '2024-04-10',
        endDate: '2024-07-10',
        enrollmentStart: '2024-03-01',
        enrollmentEnd: '2024-03-31',
        location: null,
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-5',
        title: 'UI/UX Design',
        description:
            'Crie designs dignos de um profissional! Aprenda os princípios de usabilidade, prototipagem no Figma, pesquisa com usuários e construção de interfaces acessíveis.',
        modality: 'online',
        workloadHours: 50,
        vacancyCount: 15,
        startDate: '2024-05-06',
        endDate: '2024-07-06',
        enrollmentStart: '2024-04-01',
        enrollmentEnd: '2024-04-30',
        location: null,
        imageUrl: null,
        externalLink: null,
    },
];

export const enrollmentsMock: EnrollmentDto[] = [
    {
        courseId: 'mock-id-1',
        status: 'enrolled',
        enrolledAt: '2026-07-15T10:30:00.000Z',
    },
    {
        courseId: 'mock-id-2',
        status: 'interested',
        enrolledAt: '2026-07-16T09:00:00.000Z',
    },
];

export const getCoursesMock = async (): Promise<CourseDto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return coursesMock;
};

export const getEnrollmentsMock = async (): Promise<EnrollmentDto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return enrollmentsMock;
};
