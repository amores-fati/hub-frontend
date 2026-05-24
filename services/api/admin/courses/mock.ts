import {
    AdminCourseDto,
    AdminCourseModality,
    AdminCoursesResponse,
    CreateAdminCourseDto,
} from '@/dtos/AdminCourseDto';

export const getAdminCoursesMock = (): AdminCoursesResponse => ({
    data: [
        {
            id: 'mock-id-1',
            name: 'Curso 1',
            modality: AdminCourseModality.PRESENTIAL,
            address: 'Av. Ipiranga, 6681 - Partenon, Porto Alegre - RS, 90619-900',
            startDate: '2026-02-23',
            endDate: '2026-04-23',
        },
        {
            id: 'mock-id-2',
            name: 'Curso 2',
            modality: AdminCourseModality.ONLINE,
            address: null,
            startDate: '2026-03-01',
            endDate: '2026-06-30',
        },
        {
            id: 'mock-id-3',
            name: 'Curso 3',
            modality: AdminCourseModality.PRESENTIAL,
            address: 'Av. Ipiranga, 6690 - Jardim Botânico, Porto Alegre - RS, 90610-000',
            startDate: '2026-02-23',
            endDate: '2026-04-23',
        },
        {
            id: 'mock-id-4',
            name: 'Curso 4',
            modality: AdminCourseModality.ONLINE,
            address: null,
            startDate: '2026-02-23',
            endDate: '2026-04-23',
        },
        {
            id: 'mock-id-5',
            name: 'Curso 5',
            modality: AdminCourseModality.ONLINE,
            address: 'PUCRS Prédio 40, Av. Ipiranga, 6681 - Partenon, Porto Alegre - RS, 90619-900',
            startDate: '2026-04-15',
            endDate: '2026-07-15',
        },
    ],
    total: 245,
    page: 1,
    limit: 5,
});

export const createAdminCourseMock = (data: CreateAdminCourseDto): AdminCourseDto => ({
    id: 'mock-id-novo',
    name: data.name,
    modality: data.modality,
    address: data.address,
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
});
