'use client';

import { Input, Loading, Select } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import { Chip, Collapse, IconButton } from '@mui/material';
import {
    SearchRounded as SearchRoundedIcon,
    FilterListRounded as FilterListRoundedIcon,
    PictureAsPdfRounded as PictureAsPdfRoundedIcon,
    RestartAltRounded as RestartAltRoundedIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
    KeyboardArrowUpRounded as KeyboardArrowUpRoundedIcon,
    AddRounded as AddRoundedIcon,
    DeleteOutlineRounded,
} from '@mui/icons-material';
import { ButtonComponent } from '@/components/base/Button/button';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';
import {
    Action,
    State,
    TableStoreProvider,
    useTableStore,
} from '@/stores/TableStoreProvider';
import { Cells, CellType } from '@/components/base/Table2/types';
import BasicTable from '@/components/base/Table2/table';
import { deleteConfirmation } from './Swal';
import {
    AdminCourseDto,
    AdminCourseModality,
    AdminCoursesQueryParams,
} from '@/dtos/AdminCourseDto';
import {
    useGetAdminCourseById,
    useGetAdminCourses,
} from '@/services/api/admin/courses/queries';
import { formatDateToBR } from '@/utils/shared-functions/date';
import LoadingModal from '@/components/Modal';
import { AdminCourseFormModal } from '@/components/AdminCourseFormModal';
import { useDeleteCourseMutation } from '@/services/api/courses/mutations';

const modalityFilterOptions: Option[] = [
    { value: AdminCourseModality.PRESENTIAL, label: 'Presencial' },
    { value: AdminCourseModality.ONLINE, label: 'Online' },
];

type AppliedFiltersState = {
    search: string;
    modality?: AdminCourseModality;
};

const initialFiltersState: AppliedFiltersState = {
    search: '',
};

const exportCoursesToPdf = (
    printWindow: Window | null,
    courses: AdminCourseDto[],
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

    const rows = courses
        .map(
            (course) => `
                <tr>
                    <td>${course.title}</td>
                    <td>${course.modality}</td>
                    <td>${course.location}</td>
                    <td>${formatDateToBR(course.startDate)}</td>
                    <td>${formatDateToBR(course.endDate)}</td>
                    <td>${formatDateToBR(course.enrollmentStart)}</td>
                    <td>${formatDateToBR(course.enrollmentEnd)}</td>
                </tr>
            `,
        )
        .join('');

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
                <p>Total de cursos: ${courses.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Modalidade</th>
                            <th>Localização</th>
                            <th>Data Inicial</th>
                            <th>Data Final</th>
                            <th>Início de Inscrição</th>
                            <th>Fim de Inscrição</th>
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

const handleExportSelected = (selectedCourses: AdminCourseDto[]) => {
    if (selectedCourses.length === 0) {
        toast.info('Selecione pelo menos um curso para exportar.');
        return;
    }

    // window.open deve ser chamado ANTES de qualquer await
    const printWindow = window.open('', '_blank', 'width=1120,height=840');

    try {
        exportCoursesToPdf(printWindow, selectedCourses, 'Gestão de Cursos');
    } catch {
        printWindow?.close();
        toast.error('Não foi possível exportar os cursos selecionados.');
    }
};

export default function Index() {
    return (
        <TableStoreProvider>
            <AdminStudents />
        </TableStoreProvider>
    );
}

function AdminStudents() {
    const paginator = useTableStore((state) => ({
        ...state.paginator,
    }));
    const setPaginator = useTableStore((state) => state.setPaginator);
    const setIsLoading = useTableStore((state) => state.setIsLoading);
    const setCells = useTableStore(
        (s: State<AdminCourseDto> & Action<AdminCourseDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<AdminCourseDto> & Action<AdminCourseDto>) => s.setContent,
    );
    const selectedCourses = useTableStore((state) => state.selectedRows);
    const setSelectedCourses = useTableStore((state) => state.setSelectedRows);

    const [searchInput, setSearchInput] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [modality, setModality] = useState<Option | null>(null);
    const [filters, setFilters] =
        useState<AppliedFiltersState>(initialFiltersState);
    const [selectedCourse, setSelectedCourse] = useState<AdminCourseDto | null>(
        null,
    );
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const getParameters = (): AdminCoursesQueryParams => {
        return {
            page: paginator.page,
            limit: paginator.rowsPerPage,
            search: filters.search || undefined,
            sortBy: paginator.orderColumn,
            sortOrder: paginator.orderDirection,
            modality: filters.modality || undefined,
            startDate: undefined,
            endDate: undefined,
        };
    };

    const { data, isLoading, isFetching, isError } =
        useGetAdminCourses(getParameters());

    useEffect(() => {
        if (isLoading || isFetching) setIsLoading(true);
    }, [isLoading, isFetching]);

    useEffect(() => {
        if (!data || !data?.data) return;
        setContent(data.data);
        setPaginator({
            itemsCount: data.total,
        });
        setIsLoading(false);
    }, [data, isLoading, isFetching]);

    const { mutate: deleteCourseMutation, isPending } =
        useDeleteCourseMutation();

    useEffect(() => {
        setSelectedCourses({});
    }, [isPending]);

    const courses = data?.data ?? [];
    const selectedCountLabel = `${Object.keys(selectedCourses).length} curso${
        Object.keys(selectedCourses).length === 1 ? '' : 's'
    } selecionado${Object.keys(selectedCourses).length === 1 ? '' : 's'}`;

    const handleApplyAllFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            modality: modality
                ? (modality.value as AdminCourseModality)
                : undefined,
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setModality(null);
        setPaginator({ page: 1 });
        setFilters(initialFiltersState);
    };

    const cells: Cells<AdminCourseDto>[] = [
        {
            key: 'id',
            header: '',
            type: CellType.CHECKBOX,
            sortable: false,
        },
        {
            key: 'title',
            header: 'Nome',
            type: CellType.TEXT,
            sortable: false,
            render: (course: AdminCourseDto) => (
                <div className='admin-students__student-cell'>
                    <div>
                        <button
                            type='button'
                            className='admin-students__name-button'
                            onClick={() => setSelectedCourse(course)}
                        >
                            {course.title}
                        </button>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: false,
            render: (course: AdminCourseDto) => {
                const isActive = `${course.status}`.toUpperCase() === 'ATIVO';
                return (
                    <Chip
                        label={isActive ? 'Ativo' : 'Inativo'}
                        className={`admin-courses__badge ${isActive ? 'admin-courses__badge--active' : 'admin-courses__badge--inactive'}`}
                    />
                );
            },
        },
        {
            key: 'modality',
            header: 'Modalidade',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={
                        `${course.modality}`.toLowerCase() ===
                        `${AdminCourseModality.PRESENTIAL}`.toLowerCase()
                            ? 'PRESENCIAL'
                            : 'ONLINE'
                    }
                    className={
                        `${course.modality}`.toLowerCase() ===
                        `${AdminCourseModality.PRESENTIAL}`.toLowerCase()
                            ? 'admin-courses__badge admin-courses__badge--presential'
                            : 'admin-courses__badge admin-courses__badge--online'
                    }
                />
            ),
        },
        {
            key: 'location',
            header: 'Localidade',
            type: CellType.TEXT,
            sortable: false,
        },
        {
            key: 'startDate',
            header: 'Data Inicial',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={formatDateToBR(course.startDate)}
                    className='admin-courses__badge admin-courses__badge--date'
                />
            ),
        },
        {
            key: 'endDate',
            header: 'Data Final',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={formatDateToBR(course.endDate)}
                    className='admin-courses__badge admin-courses__badge--date'
                />
            ),
        },
        {
            key: 'enrollmentStart',
            header: 'Data Inicial Registro',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={formatDateToBR(course.enrollmentStart)}
                    className='admin-courses__badge admin-courses__badge--date'
                />
            ),
        },
        {
            key: 'enrollmentEnd',
            header: 'Data Final Registro',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={formatDateToBR(course.enrollmentEnd)}
                    className='admin-courses__badge admin-courses__badge--date'
                />
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            sortable: false,
            render: (course: AdminCourseDto) => (
                <IconButton
                    className='custom-table__action-button'
                    component='a'
                    target='_blank'
                    rel='noreferrer'
                    onClick={() => {
                        void deleteConfirmation(
                            deleteCourseMutation,
                            course.id,
                        );
                    }}
                >
                    <DeleteOutlineRounded fontSize='small' />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    return (
        <section className='admin-courses'>
            <div className='admin-courses__header'>
                <div>
                    <span className='admin-courses__eyebrow'>
                        Area administrativa
                    </span>
                    <h1>Gestão de Cursos</h1>
                </div>

                <div className='admin-courses__header-actions'>
                    {/* <ButtonComponent onClick={() => setShowCreateModal(true)}>
                        <span className='admin-courses__button-content'>
                            <AddRoundedIcon fontSize='small' />
                            Novo Curso
                        </span>
                    </ButtonComponent> */}
                </div>

                <div className='admin-courses__header-action'>
                    <ButtonComponent onClick={() => setShowCreateModal(true)}>
                        <span className='admin-courses__button-content'>
                            <AddRoundedIcon fontSize='small' />
                            Novo Curso
                        </span>
                    </ButtonComponent>

                    {/* <ButtonComponent
                        variant='secondary'
                        onClick={() => {
                            void handleExportAll();
                        }}
                        disabled={isExporting || isLoading}
                    >
                        <span className='admin-courses__button-content'>
                            {isExporting ? (
                                <CircularProgress size={16} />
                            ) : (
                                <FileDownloadOutlinedIcon fontSize='small' />
                            )}
                            Exportar todos cursos
                        </span>
                    </ButtonComponent> */}
                </div>
            </div>

            <div className='admin-courses__filters-card'>
                <div className='admin-courses__search-row'>
                    <div className='admin-courses__search-input'>
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
                            placeholder='Buscar por nome'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent
                        onClick={handleApplyAllFilters}
                        disabled={isLoading}
                    >
                        <span className='admin-courses__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleClearFilters}
                    >
                        <span className='admin-courses__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <small className='admin-courses__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

                <button
                    className='admin-courses__advanced-toggle'
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
                    <div className='admin-courses__advanced-grid'>
                        <div>
                            <label className='admin-courses__field-label'>
                                Modalidade do curso
                            </label>
                            <Select
                                placeholder='Selecione as modalidades'
                                options={modalityFilterOptions}
                                value={modality}
                                onChange={(option) => setModality(option)}
                                isSearchable
                                isClearable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {Object.keys(selectedCourses).length > 0 && (
                <div className='admin-courses__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='admin-courses__bulk-actions'>
                        <button
                            type='button'
                            onClick={() => {
                                handleExportSelected(
                                    Object.values(
                                        selectedCourses,
                                    ) as AdminCourseDto[],
                                );
                            }}
                        >
                            <PictureAsPdfRoundedIcon fontSize='small' />
                            Exportar selecionados
                        </button>
                    </div>
                </div>
            )}

            <div className='admin-courses__table-card'>
                {isLoading && !data ? (
                    <div className='admin-courses__loading-state'>
                        <Loading />
                    </div>
                ) : isError ? (
                    <div className='admin-courses__empty-state'>
                        <span className='admin-courses__eyebrow'>
                            Erro ao carregar
                        </span>
                        <h2>Não foi possível carregar os cursos.</h2>
                    </div>
                ) : courses.length === 0 ? (
                    <div className='admin-courses__empty-state'>
                        <h2>
                            Nenhum curso encontrado com os filtros aplicados.
                        </h2>
                        <p>Tente ajustar a busca ou limpar os filtros.</p>
                    </div>
                ) : (
                    <>
                        <BasicTable />
                    </>
                )}
            </div>

            <AdminCourseFormModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            {!!selectedCourse && (
                <CourseModalWrapper
                    open={!!selectedCourse.id}
                    courseId={selectedCourse.id}
                    onClose={() => {
                        setSelectedCourse(null);
                        setShowCreateModal(false);
                    }}
                />
            )}
        </section>
    );
}

function CourseModalWrapper({
    open,
    courseId,
    onClose,
}: {
    open: boolean;
    courseId?: string;
    onClose: () => void;
}) {
    const { data: course, isLoading } = useGetAdminCourseById(courseId);

    if (isLoading) return <LoadingModal isOpen={!!isLoading} />;
    if (!course) return <LoadingModal isOpen={!!isLoading} />;

    return (
        <AdminCourseFormModal
            open={open}
            onClose={onClose}
            course={{
                ...course,
                startDate: formatDateToBR(course.startDate) ?? '',
                endDate: formatDateToBR(course.endDate) ?? '',
                enrollmentStart: formatDateToBR(course.enrollmentStart) ?? '',
                enrollmentEnd: formatDateToBR(course.enrollmentEnd) ?? '',
            }}
        />
    );
}
