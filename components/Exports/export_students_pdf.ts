import {
    AdminStudentCourseType,
    AdminStudentDisabilityType,
    AdminStudentDto,
    AdminStudentsQueryParams,
} from '@/dtos/AdminStudentDto';
import { getAdminStudents } from '@/services/api/admin/students/queries';
import { toast } from 'react-toastify';

const courseTypeLabels: Record<AdminStudentCourseType, string> = {
    [AdminStudentCourseType.PRESENTIAL]: 'Presencial',
    [AdminStudentCourseType.ONLINE]: 'Online',
    [AdminStudentCourseType.NOT_ENROLLED]: 'Não inscrito',
};

const disabilityLabels: Record<AdminStudentDisabilityType, string> = {
    [AdminStudentDisabilityType.NONE]: 'Não',
    [AdminStudentDisabilityType.PHYSICAL]: 'Física',
    [AdminStudentDisabilityType.HEARING]: 'Auditiva',
    [AdminStudentDisabilityType.VISUAL]: 'Visual',
    [AdminStudentDisabilityType.INTELLECTUAL]: 'Intelectual',
    [AdminStudentDisabilityType.PSYCHOSOCIAL]: 'Psicossocial',
    [AdminStudentDisabilityType.MULTIPLE]: 'Multipla',
    [AdminStudentDisabilityType.OTHER]: 'Outra',
};

export type AppliedFiltersState = Required<
    Pick<
        AdminStudentsQueryParams,
        'search' | 'courseTypes' | 'disabilityTypes' | 'locations'
    >
>;

const formatCpf = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phone;
};

export const buildFiltersSummary = (filters: AppliedFiltersState): string => {
    const appliedFilters: string[] = [];

    if (filters.search) {
        appliedFilters.push(`Busca: ${filters.search}`);
    }

    if (filters.courseTypes.length) {
        appliedFilters.push(
            `Modalidade: ${filters.courseTypes
                .map((type) => courseTypeLabels[type as AdminStudentCourseType])
                .join(', ')}`,
        );
    }

    if (filters.locations.length) {
        appliedFilters.push(`Localizacao: ${filters.locations.join(', ')}`);
    }

    if (filters.disabilityTypes.length) {
        appliedFilters.push(
            `PCD: ${filters.disabilityTypes
                .map(
                    (type) =>
                        disabilityLabels[type as AdminStudentDisabilityType],
                )
                .join(', ')}`,
        );
    }

    return appliedFilters.length ? appliedFilters.join(' | ') : 'Sem filtros';
};

export const openExportWindow = (): Window | null =>
    window.open('', '_blank', 'noopener,noreferrer,width=1120,height=840');

export const exportStudentsToPdf = (
    printWindow: Window | null,
    students: AdminStudentDto[],
    filters: AppliedFiltersState,
    title: string,
): void => {
    if (!printWindow) {
        toast.error(
            'Não foi possivel abrir a janela de exportação. Verifique o bloqueador de pop-up.',
        );
        return;
    }

    const generatedAt = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date());

    const rows = students
        .map(
            (student) => `
                <tr>
                    <td>${student.fullName}</td>
                    <td>${formatCpf(student.cpf)}</td>
                    <td>${student.enrolledCourse?.name ?? 'Não inscrito'}</td>
                    <td>${student.email}<br />${formatPhone(student.phone)}</td>
                    <td>${student.city}/${student.state}</td>
                    <td>${disabilityLabels[student.disabilityType]}</td>
                </tr>
            `,
        )
        .join('');

    const summary = buildFiltersSummary(filters);

    printWindow.document.write(`
        <html lang="pt-BR">
            <head>
                <title>${title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 32px;
                        color: #1d1d1d;
                    }
                    h1 {
                        margin-bottom: 8px;
                    }
                    p {
                        margin: 0 0 8px 0;
                        color: #4f4f4f;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 24px;
                    }
                    th, td {
                        border: 1px solid #e0e0e0;
                        padding: 10px;
                        text-align: left;
                        font-size: 12px;
                        vertical-align: top;
                    }
                    th {
                        background: #f8f9fa;
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Data de geracao: ${generatedAt}</p>
                <p>Filtros aplicados: ${summary}</p>
                <p>Total de alunos: ${students.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Curso</th>
                            <th>Contato</th>
                            <th>Localizacao</th>
                            <th>PCD</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};

export async function getStudentsForExport(filters: AppliedFiltersState): Promise<AdminStudentDto[]> {
    const firstPage = await getAdminStudents({
        ...filters,
        page: 1,
        limit: 100,
    });

    const totalPages = Math.ceil(firstPage.total / firstPage.limit);

    if (totalPages <= 1) {
        return firstPage.data;
    }

    const pages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
            getAdminStudents({
                ...filters,
                page: index + 2,
                limit: firstPage.limit,
            }),
        ),
    );

    return [firstPage, ...pages].flatMap((page) => page.data);
}