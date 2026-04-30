import { CourseDto, EnrollmentDto } from '@/dtos/CourseDto';

export const coursesMock: CourseDto[] = [
    {
        id: 'mock-id-1',
        title: 'Desenvolvimento Web',
        description:
            'Curso completo de desenvolvimento web do zero ao avançado. Abrange HTML, CSS, JavaScript, React e Node.js com projetos práticos ao longo de toda a jornada.',
        modality: 'online',
        workloadHours: 80,
        vacancyCount: 30,
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        enrollmentStart: '2024-02-01',
        enrollmentEnd: '2024-02-28',
        location: null,
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-2',
        title: 'Análise de Dados com Python',
        description:
            'Introdução à análise e visualização de dados utilizando Python, Pandas, Matplotlib e conceitos de estatística aplicada ao mercado de trabalho.',
        modality: 'hibrido',
        workloadHours: 60,
        vacancyCount: 20,
        startDate: '2024-04-10',
        endDate: '2024-07-10',
        enrollmentStart: '2024-03-01',
        enrollmentEnd: '2024-03-31',
        location: 'Porto Alegre - RS',
        imageUrl: null,
        externalLink: null,
    },
    {
        id: 'mock-id-3',
        title: 'Comunicação Profissional e Liderança',
        description:
            'Desenvolvimento de habilidades de comunicação, liderança e trabalho em equipe voltado para o ambiente corporativo e processos seletivos.',
        modality: 'presencial',
        workloadHours: 40,
        vacancyCount: 25,
        startDate: '2024-05-06',
        endDate: '2024-07-06',
        enrollmentStart: '2024-04-01',
        enrollmentEnd: '2024-04-30',
        location: 'Porto Alegre - RS',
        imageUrl: null,
        externalLink: null,
    },
];

export const enrollmentsMock: EnrollmentDto[] = [
    {
        courseId: 'mock-id-1',
        status: 'enrolled',
        enrolledAt: '2024-01-15T10:30:00.000Z',
    },
    {
        courseId: 'mock-id-2',
        status: 'interested',
        enrolledAt: '2024-01-16T09:00:00.000Z',
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
