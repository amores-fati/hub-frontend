'use client';

import { Input, Loading, MultSelect, Table } from '@/components/base';
import {
    FamilyIncome,
    Gender,
    Race,
    Scholarship,
    SocialBenefit,
    WhoInformed,
} from '@/dtos/StudentDto';
import {
    AdminStudentCourseType,
    AdminStudentDisabilityType,
    AdminStudentDto,
    AdminStudentsQueryParams,
    AdminStudentsSortField,
    AdminStudentsSortOrder,
} from '@/dtos/AdminStudentDto';
import { UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useDeleteAdminStudents } from '@/services/api/admin/students/mutations';
import { getAdminStudentsFilterOptionsMock } from '@/services/api/admin/students/mock';
import {
    getAdminStudents,
    useGetAdminStudents,
} from '@/services/api/admin/students/queries';
import { Option } from '@/components/base/Select/select';
import {
    Avatar,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import Checkbox from '@/components/base/Checkbox/checkbox';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { ButtonComponent } from '@/components/base/Button/button';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

const PAGE_SIZE = 20;

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

const genderLabels: Record<Gender, string> = {
    [Gender.FEMALE]: 'Feminino',
    [Gender.MALE]: 'Masculino',
    [Gender.NON_BINARY]: 'Não-binário',
    [Gender.PREFER_NOT_TO_SAY]: 'Prefiro não informar',
    [Gender.OTHER]: 'Outro',
};

const raceLabels: Record<Race, string> = {
    [Race.WHITE]: 'Branco',
    [Race.BLACK]: 'Preto',
    [Race.BROWN]: 'Pardo',
    [Race.INDIGENOUS]: 'Indígena',
    [Race.PREFER_NOT_TO_SAY]: 'Prefiro não dizer',
};

const scholarshipLabels: Record<Scholarship, string> = {
    [Scholarship.INCOMPLETE_FUNDAMENTAL]: 'Fundamental incompleto',
    [Scholarship.COMPLETE_MEDIUM]: 'Médio completo',
    [Scholarship.INCOMPLETE_SUPERIOR]: 'Superior incompleto',
    [Scholarship.COMPLETE_SUPERIOR]: 'Superior completo',
};

const whoInformedLabels: Record<WhoInformed, string> = {
    [WhoInformed.INSTAGRAM]: 'Instagram',
    [WhoInformed.REFEREE]: 'Indicação',
    [WhoInformed.LINKEDIN]: 'LinkedIn',
    [WhoInformed.OTHERS]: 'Outros',
};

const familyIncomeLabels: Record<FamilyIncome, string> = {
    [FamilyIncome.TO1_SALARY]: 'Até 1 salário mínimo',
    [FamilyIncome.BETWEEN_1_3]: '1 a 3 salários mínimos',
    [FamilyIncome.MORE_THAN_3]: 'Mais de 3 salários',
};

const socialBenefitLabels: Record<SocialBenefit, string> = {
    [SocialBenefit.BOLSA_FAMILIA]: 'Bolsa Família',
    [SocialBenefit.BPC]: 'BPC',
    [SocialBenefit.NONE]: 'Nenhum',
    [SocialBenefit.OTHERS]: 'Outros',
};

const courseTypeOptions: Option[] = [
    {
        value: AdminStudentCourseType.PRESENTIAL,
        label: courseTypeLabels[AdminStudentCourseType.PRESENTIAL],
    },
    {
        value: AdminStudentCourseType.ONLINE,
        label: courseTypeLabels[AdminStudentCourseType.ONLINE],
    },
    {
        value: AdminStudentCourseType.NOT_ENROLLED,
        label: courseTypeLabels[AdminStudentCourseType.NOT_ENROLLED],
    },
];

const disabilityOptions: Option[] = [
    {
        value: AdminStudentDisabilityType.NONE,
        label: disabilityLabels[AdminStudentDisabilityType.NONE],
    },
    {
        value: AdminStudentDisabilityType.PHYSICAL,
        label: disabilityLabels[AdminStudentDisabilityType.PHYSICAL],
    },
    {
        value: AdminStudentDisabilityType.HEARING,
        label: disabilityLabels[AdminStudentDisabilityType.HEARING],
    },
    {
        value: AdminStudentDisabilityType.VISUAL,
        label: disabilityLabels[AdminStudentDisabilityType.VISUAL],
    },
    {
        value: AdminStudentDisabilityType.INTELLECTUAL,
        label: disabilityLabels[AdminStudentDisabilityType.INTELLECTUAL],
    },
    {
        value: AdminStudentDisabilityType.PSYCHOSOCIAL,
        label: disabilityLabels[AdminStudentDisabilityType.PSYCHOSOCIAL],
    },
    {
        value: AdminStudentDisabilityType.MULTIPLE,
        label: disabilityLabels[AdminStudentDisabilityType.MULTIPLE],
    },
    {
        value: AdminStudentDisabilityType.OTHER,
        label: disabilityLabels[AdminStudentDisabilityType.OTHER],
    },
];

type AppliedFiltersState = Required<
    Pick<
        AdminStudentsQueryParams,
        'search' | 'courseTypes' | 'disabilityTypes' | 'locations'
    >
>;

type SortState = {
    field: AdminStudentsSortField;
    order: AdminStudentsSortOrder;
};

const initialFiltersState: AppliedFiltersState = {
    search: '',
    courseTypes: [],
    disabilityTypes: [],
    locations: [],
};

const initialSortState: SortState = {
    field: 'fullName',
    order: 'asc',
};

const locationOptions: Option[] =
    getAdminStudentsFilterOptionsMock().locations.map((location) => ({
        value: location,
        label: location,
    }));

const normalizeText = (value: string) =>
    value
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .trim();

const formatCpf = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

const formatMaskedCpf = (cpf: string) =>
    cpf.replace(/(\d{3})\d{3}(\d{3})(\d{2})/, '$1.***.$2-$3');

const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phone;
};

const formatDate = (value?: string | null) => {
    if (!value) {
        return 'Não informado';
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('pt-BR').format(date);
};

const buildWhatsAppLink = (phone: string) =>
    `https://wa.me/55${phone.replace(/\D/g, '')}`;

const getBooleanLabel = (value?: boolean) =>
    value === undefined ? 'Não informado' : value ? 'Sim' : 'Não';

const getCourseType = (student: AdminStudentDto) =>
    student.enrolledCourse?.modality ?? AdminStudentCourseType.NOT_ENROLLED;

const getCourseBadgeClassName = (student: AdminStudentDto) => {
    const courseType = getCourseType(student);

    if (courseType === AdminStudentCourseType.PRESENTIAL) {
        return 'admin-students__badge admin-students__badge--presential';
    }

    if (courseType === AdminStudentCourseType.ONLINE) {
        return 'admin-students__badge admin-students__badge--online';
    }

    return 'admin-students__badge admin-students__badge--neutral';
};

const getDisabilityBadgeClassName = (student: AdminStudentDto) =>
    student.isPcd
        ? 'admin-students__badge admin-students__badge--info'
        : 'admin-students__badge admin-students__badge--danger';

const buildFiltersSummary = (filters: AppliedFiltersState) => {
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

const openExportWindow = () =>
    window.open('', '_blank', 'noopener,noreferrer,width=1120,height=840');

const exportStudentsToPdf = (
    printWindow: Window | null,
    students: AdminStudentDto[],
    filters: AppliedFiltersState,
    title: string,
) => {
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
                <p>Data de geração: ${generatedAt}</p>
                <p>Filtros aplicados: ${summary}</p>
                <p>Total de alunos: ${students.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Curso</th>
                            <th>Contato</th>
                            <th>Localização</th>
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

async function getStudentsForExport(filters: AppliedFiltersState) {
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

export function AdminStudents() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [draftCourseTypes, setDraftCourseTypes] = useState<Option[]>([]);
    const [draftLocations, setDraftLocations] = useState<Option[]>([]);
    const [draftDisabilityTypes, setDraftDisabilityTypes] = useState<Option[]>(
        [],
    );
    const [filters, setFilters] =
        useState<AppliedFiltersState>(initialFiltersState);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedStudent, setSelectedStudent] =
        useState<AdminStudentDto | null>(null);
    const [studentsPendingDelete, setStudentsPendingDelete] = useState<
        AdminStudentDto[]
    >([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isExportingAll, setIsExportingAll] = useState(false);
    const [isExportingSelected, setIsExportingSelected] = useState(false);
    const [sort, setSort] = useState<SortState>(initialSortState);

    const isAdmin = !user || user.role === UserRole.ADMIN;
    const queryParams = useMemo<AdminStudentsQueryParams>(
        () => ({
            page,
            limit: PAGE_SIZE,
            search: filters.search || undefined,
            courseTypes: filters.courseTypes,
            disabilityTypes: filters.disabilityTypes,
            locations: filters.locations,
            sortBy: sort.field,
            sortOrder: sort.order,
        }),
        [filters, page, sort],
    );

    const { data, isLoading, isFetching, isError } = useGetAdminStudents(
        queryParams,
        isAdmin,
    );

    const deleteStudentsMutation = useDeleteAdminStudents(selectedIds);

    const students = data?.data ?? [];
    const totalStudents = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
    const visibleStudentIds = students.map((student) => student.id);
    const selectedVisibleCount = visibleStudentIds.filter((id) =>
        selectedIds.includes(id),
    ).length;
    const allVisibleSelected =
        visibleStudentIds.length > 0 &&
        selectedVisibleCount === visibleStudentIds.length;
    const someVisibleSelected =
        selectedVisibleCount > 0 &&
        selectedVisibleCount < visibleStudentIds.length;

    const selectedCountLabel = `${selectedIds.length} aluno${
        selectedIds.length === 1 ? '' : 's'
    } selecionado${selectedIds.length === 1 ? '' : 's'}`;

    if (!isAdmin) {
        return (
            <section className='admin-students admin-students--restricted'>
                <div className='admin-students__empty-state'>
                    <span className='admin-students__eyebrow'>
                        Acesso restrito
                    </span>
                    <h1>Somente administradores podem acessar esta tela.</h1>
                </div>
            </section>
        );
    }

    const handleApplyAllFilters = () => {
        setPage(1);
        setFilters({
            search: searchInput.trim(),
            courseTypes: draftCourseTypes.map((option) => String(option.value)),
            locations: draftLocations.map((option) => String(option.value)),
            disabilityTypes: draftDisabilityTypes.map((option) =>
                String(option.value),
            ),
        });
    };

    const handleClearFilters = () => {
        setPage(1);
        setSearchInput('');
        setDraftCourseTypes([]);
        setDraftLocations([]);
        setDraftDisabilityTypes([]);
        setFilters(initialFiltersState);
        setSelectedIds([]);
        setSort(initialSortState);
    };

    const handleSort = (field: AdminStudentsSortField) => {
        setPage(1);
        setSort((currentSort) => ({
            field,
            order:
                currentSort.field === field && currentSort.order === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedIds((currentSelection) =>
            currentSelection.includes(studentId)
                ? currentSelection.filter((id) => id !== studentId)
                : [...currentSelection, studentId],
        );
    };

    const toggleVisibleSelection = () => {
        if (allVisibleSelected) {
            setSelectedIds((currentSelection) =>
                currentSelection.filter(
                    (id) => !visibleStudentIds.includes(id),
                ),
            );
            return;
        }

        setSelectedIds((currentSelection) => [
            ...new Set([...currentSelection, ...visibleStudentIds]),
        ]);
    };

    const handleDeleteStudents = async () => {
        if (studentsPendingDelete.length === 0) {
            return;
        }

        const idsToDelete = studentsPendingDelete.map((student) => student.id);

        await deleteStudentsMutation.mutateAsync(idsToDelete);
        setSelectedIds((currentSelection) =>
            currentSelection.filter((id) => !idsToDelete.includes(id)),
        );
        setStudentsPendingDelete([]);
        setSelectedStudent((currentStudent) =>
            currentStudent && idsToDelete.includes(currentStudent.id)
                ? null
                : currentStudent,
        );
    };

    const openSingleDeleteConfirmation = (student: AdminStudentDto) => {
        setStudentsPendingDelete([student]);
    };

    const openBulkDeleteConfirmation = async () => {
        const studentsForDelete = await getStudentsForExport(filters);
        const selectedStudents = studentsForDelete.filter((student) =>
            selectedIds.includes(student.id),
        );

        if (selectedStudents.length === 0) {
            toast.info('Selecione pelo menos um aluno para excluir.');
            return;
        }

        setStudentsPendingDelete(selectedStudents);
    };

    const handleExportAll = async () => {
        const printWindow = openExportWindow();
        setIsExportingAll(true);

        try {
            const studentsForExport = await getStudentsForExport(filters);

            if (studentsForExport.length === 0) {
                printWindow?.close();
                toast.info(
                    'Não há alunos para exportar com os filtros atuais.',
                );
                return;
            }

            exportStudentsToPdf(
                printWindow,
                studentsForExport,
                filters,
                'Gestão de Alunos',
            );
        } catch {
            printWindow?.close();
            toast.error('Não foi possível exportar a lista agora.');
        } finally {
            setIsExportingAll(false);
        }
    };

    const handleExportSelected = async () => {
        const printWindow = openExportWindow();
        setIsExportingSelected(true);

        try {
            const studentsForExport = await getStudentsForExport(filters);
            const selectedStudents = studentsForExport.filter((student) =>
                selectedIds.includes(student.id),
            );

            if (selectedStudents.length === 0) {
                printWindow?.close();
                toast.info('Selecione pelo menos um aluno para exportar.');
                return;
            }

            exportStudentsToPdf(
                printWindow,
                selectedStudents,
                filters,
                'Gestão de Alunos',
            );
        } catch {
            printWindow?.close();
            toast.error('Não foi possível exportar os alunos selecionados.');
        } finally {
            setIsExportingSelected(false);
        }
    };

    const rangeStart = totalStudents === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(page * PAGE_SIZE, totalStudents);
    const columns = useMemo(
        () => [
            {
                key: 'name',
                header: 'Nome',
                sortable: true,
                sortField: 'fullName',
                render: (student: AdminStudentDto) => (
                    <div className='admin-students__student-cell'>
                        <Avatar
                            src={student.photoUrl || undefined}
                            className='admin-students__avatar'
                        >
                            {student.fullName
                                .split(' ')
                                .slice(0, 2)
                                .map((name) => name[0]?.toUpperCase())
                                .join('')}
                        </Avatar>

                        <div>
                            <button
                                type='button'
                                className='admin-students__name-button'
                                onClick={() => setSelectedStudent(student)}
                            >
                                {student.fullName}
                            </button>
                            <span>{formatMaskedCpf(student.cpf)}</span>
                        </div>
                    </div>
                ),
            },
            {
                key: 'course',
                header: 'Curso',
                sortable: true,
                sortField: 'course',
                render: (student: AdminStudentDto) => (
                    <Chip
                        label={courseTypeLabels[getCourseType(student)]}
                        className={getCourseBadgeClassName(student)}
                    />
                ),
            },
            {
                key: 'contact',
                header: 'Contato',
                sortable: true,
                sortField: 'contact',
                render: (student: AdminStudentDto) => (
                    <div className='admin-students__meta-cell'>
                        <span>{student.email}</span>
                        <small>
                            <a
                                href={buildWhatsAppLink(student.phone)}
                                target='_blank'
                                rel='noreferrer'
                                className='admin-students__contact-link'
                            >
                                {formatPhone(student.phone)}
                            </a>
                        </small>
                    </div>
                ),
            },
            {
                key: 'location',
                header: 'Localização',
                sortable: true,
                sortField: 'location',
                render: (student: AdminStudentDto) => (
                    <>
                        {normalizeText(student.city)}/{student.state}
                    </>
                ),
            },
            {
                key: 'pcd',
                header: 'PCD',
                sortable: true,
                sortField: 'pcd',
                render: (student: AdminStudentDto) => (
                    <Chip
                        label={disabilityLabels[student.disabilityType]}
                        className={getDisabilityBadgeClassName(student)}
                    />
                ),
            },
        ],
        [],
    );

    return (
        <section className='admin-students'>
            <div className='admin-students__header'>
                <div>
                    <span className='admin-students__eyebrow'>
                        Area administrativa
                    </span>
                    <h1>Gestão de Alunos</h1>
                </div>

                <div className='admin-students__header-action'>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => {
                            void handleExportAll();
                        }}
                        disabled={isExportingAll || isLoading}
                    >
                        <span className='admin-students__button-content'>
                            {isExportingAll ? (
                                <CircularProgress size={16} />
                            ) : (
                                <FileDownloadOutlinedIcon fontSize='small' />
                            )}
                            Exportar todos alunos
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            <div className='admin-students__filters-card'>
                <div className='admin-students__search-row'>
                    <div className='admin-students__search-input'>
                        <Input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleApplyAllFilters();
                                }
                            }}
                            placeholder='Buscar por nome, CPF, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                        <small className='admin-students__search-helper'>
                            A busca funciona com qualquer quantidade de
                            caracteres.
                        </small>
                    </div>

                    <ButtonComponent
                        onClick={handleApplyAllFilters}
                        disabled={isLoading}
                    >
                        <span className='admin-students__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleClearFilters}
                    >
                        <span className='admin-students__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <button
                    className='admin-students__advanced-toggle'
                    onClick={() => setShowAdvancedFilters((value) => !value)}
                    type='button'
                >
                    <span>
                        <FilterListRoundedIcon fontSize='small' />
                        Filtros avançados
                    </span>
                    {showAdvancedFilters ? (
                        <KeyboardArrowUpRoundedIcon fontSize='small' />
                    ) : (
                        <KeyboardArrowDownRoundedIcon fontSize='small' />
                    )}
                </button>

                <Collapse in={showAdvancedFilters}>
                    <div className='admin-students__advanced-grid'>
                        <div>
                            <label className='admin-students__field-label'>
                                Modalidade do curso
                            </label>
                            <MultSelect
                                placeholder='Selecione as modalidades'
                                options={courseTypeOptions}
                                value={draftCourseTypes}
                                onChange={(options) =>
                                    setDraftCourseTypes([...(options ?? [])])
                                }
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-students__field-label'>
                                Localização
                            </label>
                            <MultSelect
                                placeholder='Selecione as cidades'
                                options={locationOptions}
                                value={draftLocations}
                                onChange={(options) =>
                                    setDraftLocations([...(options ?? [])])
                                }
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-students__field-label'>
                                Status PCD
                            </label>
                            <MultSelect
                                placeholder='Selecione os status'
                                options={disabilityOptions}
                                value={draftDisabilityTypes}
                                onChange={(options) =>
                                    setDraftDisabilityTypes([
                                        ...(options ?? []),
                                    ])
                                }
                                isSearchable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedIds.length > 0 && (
                <div className='admin-students__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='admin-students__bulk-actions'>
                        <button
                            type='button'
                            onClick={() => {
                                void handleExportSelected();
                            }}
                            disabled={isExportingSelected}
                        >
                            {isExportingSelected ? (
                                <CircularProgress size={14} />
                            ) : (
                                <PictureAsPdfRoundedIcon fontSize='small' />
                            )}
                            Exportar selecionados
                        </button>

                        <button
                            type='button'
                            onClick={() => {
                                void openBulkDeleteConfirmation();
                            }}
                        >
                            <DeleteOutlineRoundedIcon fontSize='small' />
                            Excluir selecionados
                        </button>

                        <button
                            type='button'
                            onClick={() => setSelectedIds([])}
                        >
                            Limpar selecao
                        </button>
                    </div>
                </div>
            )}

            <div className='admin-students__table-card'>
                {isLoading && !data ? (
                    <div className='admin-students__loading-state'>
                        <Loading />
                    </div>
                ) : isError ? (
                    <div className='admin-students__empty-state'>
                        <span className='admin-students__eyebrow'>
                            Erro ao carregar
                        </span>
                        <h2>Não foi possível carregar os alunos.</h2>
                    </div>
                ) : students.length === 0 ? (
                    <div className='admin-students__empty-state'>
                        <h2>
                            Nenhum aluno encontrado com os filtros aplicados.
                        </h2>
                        <p>Tente ajustar a busca ou limpar os filtros.</p>
                    </div>
                ) : (
                    <>
                        <Table
                            values={students}
                            columns={columns}
                            getRowId={(student) => student.id}
                            selectable
                            selectedIds={selectedIds}
                            allVisibleSelected={allVisibleSelected}
                            someVisibleSelected={someVisibleSelected}
                            onToggleSelect={toggleStudentSelection}
                            onToggleSelectAll={toggleVisibleSelection}
                            sortField={sort.field}
                            sortOrder={sort.order}
                            onSortChange={(field) =>
                                handleSort(field as AdminStudentsSortField)
                            }
                            actionColumnConfig={{
                                showWhatsapp: true,
                                getWhatsappHref: (student) =>
                                    buildWhatsAppLink(student.phone),
                                showDelete: true,
                                onDelete: openSingleDeleteConfirmation,
                            }}
                            pagination={{
                                page,
                                count: totalPages,
                                onChange: setPage,
                                isFetching,
                                summaryText: `Exibindo ${rangeStart} a ${rangeEnd} de ${totalStudents} alunos`,
                            }}
                        />
                    </>
                )}
            </div>

            <Dialog
                open={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle className='admin-students__dialog-title'>
                    Perfil do aluno
                </DialogTitle>
                <DialogContent
                    dividers
                    className='admin-students__dialog-content'
                >
                    {selectedStudent && (
                        <div className='admin-students__details'>
                            <div className='admin-students__details-header'>
                                <Avatar
                                    src={selectedStudent.photoUrl || undefined}
                                    className='admin-students__avatar admin-students__avatar--large'
                                >
                                    {selectedStudent.fullName
                                        .split(' ')
                                        .slice(0, 2)
                                        .map((name) => name[0]?.toUpperCase())
                                        .join('')}
                                </Avatar>

                                <div>
                                    <h3>{selectedStudent.fullName}</h3>
                                    <p>{selectedStudent.email}</p>
                                    <div className='admin-students__details-badges'>
                                        <Chip
                                            label={
                                                courseTypeLabels[
                                                    getCourseType(
                                                        selectedStudent,
                                                    )
                                                ]
                                            }
                                            className={getCourseBadgeClassName(
                                                selectedStudent,
                                            )}
                                        />
                                        <Chip
                                            label={
                                                disabilityLabels[
                                                    selectedStudent
                                                        .disabilityType
                                                ]
                                            }
                                            className={getDisabilityBadgeClassName(
                                                selectedStudent,
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <section className='admin-students__details-section'>
                                <div className='admin-students__details-section-header'>
                                    <h4>Dados pessoais</h4>
                                    <span>
                                        Informações principais do cadastro
                                    </span>
                                </div>
                                <div className='admin-students__details-grid'>
                                    <div>
                                        <strong>Nome completo</strong>
                                        <span>{selectedStudent.fullName}</span>
                                    </div>
                                    <div>
                                        <strong>Nome social</strong>
                                        <span>
                                            {selectedStudent.socialName ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>CPF</strong>
                                        <span>
                                            {formatCpf(selectedStudent.cpf)}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Data de nascimento</strong>
                                        <span>
                                            {formatDate(
                                                selectedStudent.birthDate,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Telefone</strong>
                                        <span>
                                            {formatPhone(selectedStudent.phone)}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Gênero</strong>
                                        <span>
                                            {selectedStudent.gender
                                                ? genderLabels[
                                                      selectedStudent.gender
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Raça/Cor</strong>
                                        <span>
                                            {selectedStudent.race
                                                ? raceLabels[
                                                      selectedStudent.race
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className='admin-students__details-section'>
                                <div className='admin-students__details-section-header'>
                                    <h4>Endereço e escolaridade</h4>
                                    <span>Dados de localização e formação</span>
                                </div>
                                <div className='admin-students__details-grid'>
                                    <div>
                                        <strong>CEP</strong>
                                        <span>
                                            {selectedStudent.cep ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Cidade / Estado</strong>
                                        <span>
                                            {selectedStudent.city}/
                                            {selectedStudent.state}
                                        </span>
                                    </div>
                                    <div className='admin-students__details-grid-item--full'>
                                        <strong>Endereço</strong>
                                        <span>
                                            {selectedStudent.address ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Bairro</strong>
                                        <span>
                                            {selectedStudent.neighbourhood ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Complemento</strong>
                                        <span>
                                            {selectedStudent.complement ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Escolaridade</strong>
                                        <span>
                                            {selectedStudent.scholarship
                                                ? scholarshipLabels[
                                                      selectedStudent
                                                          .scholarship
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Instituição</strong>
                                        <span>
                                            {selectedStudent.institution ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Curso atual</strong>
                                        <span>
                                            {selectedStudent.enrolledCourse
                                                ?.name || 'Não inscrito'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className='admin-students__details-section'>
                                <div className='admin-students__details-section-header'>
                                    <h4>FatiLab e perfil socioeconômico</h4>
                                    <span>
                                        Motivação, recursos e contexto familiar
                                    </span>
                                </div>
                                <div className='admin-students__details-grid'>
                                    <div>
                                        <strong>Como conheceu</strong>
                                        <span>
                                            {selectedStudent.whomInformed
                                                ? whoInformedLabels[
                                                      selectedStudent
                                                          .whomInformed
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Renda familiar</strong>
                                        <span>
                                            {selectedStudent.familyIncome
                                                ? familyIncomeLabels[
                                                      selectedStudent
                                                          .familyIncome
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Pessoas na casa</strong>
                                        <span>
                                            {selectedStudent.peopleInHouse ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Benefício social</strong>
                                        <span>
                                            {selectedStudent.socialBenefit
                                                ? socialBenefitLabels[
                                                      selectedStudent
                                                          .socialBenefit
                                                  ]
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Computador próprio</strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.hasOwnComputer,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Acesso à internet</strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.hasInternetAccess,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>
                                            Compromisso com as aulas
                                        </strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.compromisedToClasses,
                                            )}
                                        </span>
                                    </div>
                                    <div className='admin-students__details-grid-item--full'>
                                        <strong>
                                            Motivação para o FatiLab
                                        </strong>
                                        <span>
                                            {selectedStudent.whyJoinFatiLab ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className='admin-students__details-section'>
                                <div className='admin-students__details-section-header'>
                                    <h4>Experiência e acessibilidade</h4>
                                    <span>
                                        Histórico profissional e informações PCD
                                    </span>
                                </div>
                                <div className='admin-students__details-grid'>
                                    <div>
                                        <strong>
                                            Experiência em programação
                                        </strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.hasWorkExperience,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Cursos de tecnologia</strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.hasParticipatedOnCourses,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Trabalhando atualmente</strong>
                                        <span>
                                            {getBooleanLabel(
                                                selectedStudent.currentlyWorking,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Área de atuação</strong>
                                        <span>
                                            {selectedStudent.workField ||
                                                'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Status PCD</strong>
                                        <span>
                                            {
                                                disabilityLabels[
                                                    selectedStudent
                                                        .disabilityType
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <strong>LGPD - termos</strong>
                                        <span>
                                            {selectedStudent.lgpd
                                                ? getBooleanLabel(
                                                      selectedStudent.lgpd
                                                          .terms,
                                                  )
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>LGPD - uso de imagem</strong>
                                        <span>
                                            {selectedStudent.lgpd
                                                ? getBooleanLabel(
                                                      selectedStudent.lgpd
                                                          .imageUsage,
                                                  )
                                                : 'Não informado'}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setSelectedStudent(null)}
                    >
                        Fechar
                    </ButtonComponent>
                </DialogActions>
            </Dialog>

            <Dialog
                open={studentsPendingDelete.length > 0}
                onClose={() => setStudentsPendingDelete([])}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>
                    {studentsPendingDelete.length > 1
                        ? 'Excluir alunos'
                        : 'Excluir aluno'}
                </DialogTitle>
                <DialogContent dividers>
                    <p>
                        {studentsPendingDelete.length > 1 ? (
                            <>
                                Deseja realmente excluir{' '}
                                <strong>
                                    {studentsPendingDelete.length} alunos
                                </strong>{' '}
                                selecionados?
                            </>
                        ) : (
                            <>
                                Deseja realmente excluir{' '}
                                <strong>
                                    {studentsPendingDelete[0]?.fullName}
                                </strong>
                                ?
                            </>
                        )}
                    </p>
                </DialogContent>
                <DialogActions>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setStudentsPendingDelete([])}
                    >
                        Cancelar
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={() => {
                            void handleDeleteStudents();
                        }}
                        disabled={deleteStudentsMutation.isPending}
                    >
                        <span className='admin-students__button-content'>
                            {deleteStudentsMutation.isPending ? (
                                <CircularProgress size={16} />
                            ) : null}
                            Confirmar exclusao
                        </span>
                    </ButtonComponent>
                </DialogActions>
            </Dialog>
        </section>
    );
}
