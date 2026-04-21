import {
    AdminStudentCourseDto,
    AdminStudentCourseType,
    AdminStudentDisabilityType,
    AdminStudentDto,
    AdminStudentsQueryParams,
    AdminStudentsResponseDto,
    AdminStudentsSortField,
} from '@/dtos/AdminStudentDto';

type MockStudentSeed = {
    id: string;
    fullName: string;
    cpf: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    disabilityType: AdminStudentDisabilityType;
    course: AdminStudentCourseDto | null;
};

const courses = {
    frontend: {
        id: 'frontend',
        name: 'Desenvolvimento Frontend',
        modality: AdminStudentCourseType.PRESENTIAL,
    },
    data: {
        id: 'data',
        name: 'Análise de Dados',
        modality: AdminStudentCourseType.ONLINE,
    },
    qa: {
        id: 'qa',
        name: 'Qualidade de Software',
        modality: AdminStudentCourseType.PRESENTIAL,
    },
    ux: {
        id: 'ux',
        name: 'UX e Produto',
        modality: AdminStudentCourseType.ONLINE,
    },
} satisfies Record<string, AdminStudentCourseDto>;

const studentSeeds: MockStudentSeed[] = [
    {
        id: 'student-001',
        fullName: 'Ana Julia Martins',
        cpf: '12345678900',
        email: 'ana.julia@email.com',
        phone: '11988881234',
        city: 'Florianopolis',
        state: 'SC',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.frontend,
    },
    {
        id: 'student-002',
        fullName: 'Maria Eduarda Lima',
        cpf: '98765432111',
        email: 'maria.eduarda@email.com',
        phone: '21977774321',
        city: 'Porto Alegre',
        state: 'RS',
        disabilityType: AdminStudentDisabilityType.PHYSICAL,
        course: courses.data,
    },
    {
        id: 'student-003',
        fullName: 'Beatriz Silva',
        cpf: '45612378922',
        email: 'beatriz.silva@email.com',
        phone: '48966665555',
        city: 'Florianopolis',
        state: 'SC',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.frontend,
    },
    {
        id: 'student-004',
        fullName: 'Carlos Oliveira',
        cpf: '78945612333',
        email: 'carlos.oliveira@email.com',
        phone: '21977777777',
        city: 'Porto Alegre',
        state: 'RS',
        disabilityType: AdminStudentDisabilityType.VISUAL,
        course: null,
    },
    {
        id: 'student-005',
        fullName: 'Fernanda Costa',
        cpf: '12312312344',
        email: 'fernanda.costa@email.com',
        phone: '11988889999',
        city: 'Curitiba',
        state: 'PR',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.qa,
    },
    {
        id: 'student-006',
        fullName: 'Joao Pedro Souza',
        cpf: '32165498755',
        email: 'joao.souza@email.com',
        phone: '41999998888',
        city: 'Curitiba',
        state: 'PR',
        disabilityType: AdminStudentDisabilityType.HEARING,
        course: courses.data,
    },
    {
        id: 'student-007',
        fullName: 'Larissa Gomes',
        cpf: '65432198766',
        email: 'larissa.gomes@email.com',
        phone: '11999991111',
        city: 'Sao Paulo',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.ux,
    },
    {
        id: 'student-008',
        fullName: 'Mateus Ribeiro',
        cpf: '14725836977',
        email: 'mateus.ribeiro@email.com',
        phone: '51999992222',
        city: 'Canoas',
        state: 'RS',
        disabilityType: AdminStudentDisabilityType.PSYCHOSOCIAL,
        course: courses.frontend,
    },
    {
        id: 'student-009',
        fullName: 'Patricia Nunes',
        cpf: '25836914788',
        email: 'patricia.nunes@email.com',
        phone: '51999993333',
        city: 'Canoas',
        state: 'RS',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: null,
    },
    {
        id: 'student-010',
        fullName: 'Rafael Alves',
        cpf: '36925814799',
        email: 'rafael.alves@email.com',
        phone: '11999994444',
        city: 'Sao Paulo',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.MULTIPLE,
        course: courses.qa,
    },
    {
        id: 'student-011',
        fullName: 'Camila Ferreira',
        cpf: '74185296300',
        email: 'camila.ferreira@email.com',
        phone: '11999995555',
        city: 'Recife',
        state: 'PE',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.ux,
    },
    {
        id: 'student-012',
        fullName: 'Guilherme Rocha',
        cpf: '85296374110',
        email: 'guilherme.rocha@email.com',
        phone: '81999996666',
        city: 'Recife',
        state: 'PE',
        disabilityType: AdminStudentDisabilityType.OTHER,
        course: courses.data,
    },
    {
        id: 'student-013',
        fullName: 'Isabela Melo',
        cpf: '96374185221',
        email: 'isabela.melo@email.com',
        phone: '48999997777',
        city: 'Florianopolis',
        state: 'SC',
        disabilityType: AdminStudentDisabilityType.INTELLECTUAL,
        course: courses.frontend,
    },
    {
        id: 'student-014',
        fullName: 'Lucas Batista',
        cpf: '15935748632',
        email: 'lucas.batista@email.com',
        phone: '31999990000',
        city: 'Belo Horizonte',
        state: 'MG',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: null,
    },
    {
        id: 'student-015',
        fullName: 'Natasha Carvalho',
        cpf: '95135748643',
        email: 'natasha.carvalho@email.com',
        phone: '31999991110',
        city: 'Belo Horizonte',
        state: 'MG',
        disabilityType: AdminStudentDisabilityType.VISUAL,
        course: courses.qa,
    },
    {
        id: 'student-016',
        fullName: 'Otavio Mendes',
        cpf: '75315948654',
        email: 'otavio.mendes@email.com',
        phone: '11999992220',
        city: 'Campinas',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.data,
    },
    {
        id: 'student-017',
        fullName: 'Priscila Andrade',
        cpf: '35715948665',
        email: 'priscila.andrade@email.com',
        phone: '19999993330',
        city: 'Campinas',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.PHYSICAL,
        course: courses.ux,
    },
    {
        id: 'student-018',
        fullName: 'Renato Araujo',
        cpf: '25814736976',
        email: 'renato.araujo@email.com',
        phone: '11999994440',
        city: 'Santos',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: null,
    },
    {
        id: 'student-019',
        fullName: 'Sabrina Moraes',
        cpf: '45678912387',
        email: 'sabrina.moraes@email.com',
        phone: '13999995550',
        city: 'Santos',
        state: 'SP',
        disabilityType: AdminStudentDisabilityType.HEARING,
        course: courses.frontend,
    },
    {
        id: 'student-020',
        fullName: 'Tiago Fernandes',
        cpf: '65498732198',
        email: 'tiago.fernandes@email.com',
        phone: '11999996660',
        city: 'Rio de Janeiro',
        state: 'RJ',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.qa,
    },
    {
        id: 'student-021',
        fullName: 'Vanessa Prado',
        cpf: '74196385209',
        email: 'vanessa.prado@email.com',
        phone: '21999997770',
        city: 'Rio de Janeiro',
        state: 'RJ',
        disabilityType: AdminStudentDisabilityType.PSYCHOSOCIAL,
        course: courses.data,
    },
    {
        id: 'student-022',
        fullName: 'William Teixeira',
        cpf: '85274196310',
        email: 'william.teixeira@email.com',
        phone: '21999998880',
        city: 'Niteroi',
        state: 'RJ',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.ux,
    },
    {
        id: 'student-023',
        fullName: 'Yasmin Barros',
        cpf: '96385274121',
        email: 'yasmin.barros@email.com',
        phone: '21999999990',
        city: 'Niteroi',
        state: 'RJ',
        disabilityType: AdminStudentDisabilityType.OTHER,
        course: null,
    },
    {
        id: 'student-024',
        fullName: 'Bruno Farias',
        cpf: '14778945631',
        email: 'bruno.farias@email.com',
        phone: '71999990001',
        city: 'Salvador',
        state: 'BA',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: courses.frontend,
    },
    {
        id: 'student-025',
        fullName: 'Daniela Paiva',
        cpf: '25878945642',
        email: 'daniela.paiva@email.com',
        phone: '71999991112',
        city: 'Salvador',
        state: 'BA',
        disabilityType: AdminStudentDisabilityType.INTELLECTUAL,
        course: courses.data,
    },
    {
        id: 'student-026',
        fullName: 'Eduardo Neves',
        cpf: '36978945653',
        email: 'eduardo.neves@email.com',
        phone: '71999992223',
        city: 'Salvador',
        state: 'BA',
        disabilityType: AdminStudentDisabilityType.NONE,
        course: null,
    },
];

let deletedStudentIds = new Set<string>();

const wait = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const getCourseType = (student: AdminStudentDto) =>
    student.enrolledCourse?.modality ?? AdminStudentCourseType.NOT_ENROLLED;

const buildStudents = (): AdminStudentDto[] =>
    studentSeeds
        .filter((student) => !deletedStudentIds.has(student.id))
        .map((student) => ({
            id: student.id,
            fullName: student.fullName,
            cpf: student.cpf,
            email: student.email,
            phone: student.phone,
            city: student.city,
            state: student.state,
            isPcd: student.disabilityType !== AdminStudentDisabilityType.NONE,
            disabilityType: student.disabilityType,
            enrolledCourse: student.course,
            photoUrl: null,
        }));

const filterStudents = (
    students: AdminStudentDto[],
    params: AdminStudentsQueryParams,
) => {
    const search = normalize(params.search ?? '');
    const searchDigits = (params.search ?? '').replaceAll(/\D/g, '');
    const disabilityTypes = new Set(params.disabilityTypes ?? []);
    const locations = new Set((params.locations ?? []).map(normalize));
    const courseTypes = new Set(params.courseTypes ?? []);

    return students.filter((student) => {
        const searchText = normalize(
            [
            student.fullName,
            student.email,
            student.cpf,
            student.phone,
            student.city,
            student.state,
            student.enrolledCourse?.name ?? '',
        ].join(' '),
        );

        const studentDigits = [student.cpf, student.phone].join('');

        const matchesSearch =
            !search ||
            searchText.includes(search) ||
            (!!searchDigits && studentDigits.includes(searchDigits));

        const studentLocation = normalize(`${student.city}/${student.state}`);
        const matchesLocation =
            locations.size === 0 || locations.has(studentLocation);

        const matchesDisability =
            disabilityTypes.size === 0 ||
            disabilityTypes.has(student.disabilityType);

        const matchesCourseType =
            courseTypes.size === 0 || courseTypes.has(getCourseType(student));

        return (
            matchesSearch &&
            matchesLocation &&
            matchesDisability &&
            matchesCourseType
        );
    });
};

const getSortableValue = (
    student: AdminStudentDto,
    sortBy: AdminStudentsSortField,
) => {
    if (sortBy === 'fullName') {
        return normalize(student.fullName);
    }

    if (sortBy === 'course') {
        return normalize(student.enrolledCourse?.name ?? 'Nao inscrito');
    }

    if (sortBy === 'contact') {
        return normalize(`${student.email} ${student.phone}`);
    }

    if (sortBy === 'location') {
        return normalize(`${student.city}/${student.state}`);
    }

    return normalize(
        `${student.isPcd ? 1 : 0} ${student.disabilityType} ${student.fullName}`,
    );
};

const sortStudents = (
    students: AdminStudentDto[],
    params: AdminStudentsQueryParams,
) => {
    const sortBy = params.sortBy ?? 'fullName';
    const sortOrder = params.sortOrder ?? 'asc';
    const direction = sortOrder === 'asc' ? 1 : -1;

    return [...students].sort((first, second) => {
        const firstValue = getSortableValue(first, sortBy);
        const secondValue = getSortableValue(second, sortBy);

        if (firstValue < secondValue) {
            return -1 * direction;
        }

        if (firstValue > secondValue) {
            return 1 * direction;
        }

        return normalize(first.fullName).localeCompare(normalize(second.fullName));
    });
};

export const getAdminStudentsMock = async (
    params: AdminStudentsQueryParams,
): Promise<AdminStudentsResponseDto> => {
    await wait(400);

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const students = sortStudents(filterStudents(buildStudents(), params), params);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        data: students.slice(start, end),
        total: students.length,
        page,
        limit,
    };
};

export const deleteAdminStudentMock = async (studentId: string) => {
    await wait(250);

    if (
        deletedStudentIds.has(studentId) ||
        !studentSeeds.some((student) => student.id === studentId)
    ) {
        const error = new Error('NOT_FOUND');
        error.name = 'NOT_FOUND';
        throw error;
    }

    deletedStudentIds.add(studentId);
};

export const deleteAdminStudentsMock = async (studentIds: string[]) => {
    await wait(300);

    const invalidStudentId = studentIds.find(
        (studentId) =>
            deletedStudentIds.has(studentId) ||
            !studentSeeds.some((student) => student.id === studentId),
    );

    if (invalidStudentId) {
        const error = new Error('NOT_FOUND');
        error.name = 'NOT_FOUND';
        throw error;
    }

    studentIds.forEach((studentId) => {
        deletedStudentIds.add(studentId);
    });
};

export const getAdminStudentsFilterOptionsMock = () => {
    const students = buildStudents();

    return {
        locations: Array.from(
            new Set(students.map((student) => `${student.city}/${student.state}`)),
        ).sort((first, second) => first.localeCompare(second)),
    };
};
