'use client';

import { Input, Loading, MultSelect, Select, Table } from '@/components/base';
import { useAuth } from '@/providers/Auth/AuthProvider';
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
    IconButton,
} from '@mui/material';
import {
    SearchRounded as SearchRoundedIcon,
    FilterListRounded as FilterListRoundedIcon,
    DeleteOutlineRounded as DeleteOutlineRoundedIcon,
    WhatsApp as WhatsAppIcon,
    PictureAsPdfRounded as PictureAsPdfRoundedIcon,
    RestartAltRounded as RestartAltRoundedIcon,
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
    KeyboardArrowUpRounded as KeyboardArrowUpRoundedIcon,
    AddRounded as AddRoundedIcon,
} from '@mui/icons-material';
import { ButtonComponent } from '@/components/base/Button/button';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';
import {
    Action,
    State,
    TableStoreProvider,
    useTableStore,
} from '@/stores/TableStoreProvider';
import { Cells, CellType } from '../../components/base/Table2/types';
import BasicTable from '../../components/base/Table2/table';
import { deleteConfirmation } from './Swal';
import {
    AdminCourseDto,
    AdminCourseModality,
    AdminCoursesQueryParams,
} from '../../dtos/AdminCourseDto';
import {
    useGetAdminCourseById,
    useGetAdminCourses,
} from '../../services/api/admin/courses/queries';
import { formatDate, formatDateToBR } from '../../utils/shared-functions/date';
import { AdminStudentCourseType } from '../../dtos/AdminStudentDto';
import { useDeleteAdminStudents } from '../../services/api/admin/students/mutations';
import { dateRegex } from '../../utils/regex';
import LoadingModal from '../../components/Modal';
import { AdminCourseFormModal } from '../../components/AdminCourseFormModal';

const PAGE_SIZE = 20;

const courseTypeLabels: Record<AdminStudentCourseType, string> = {
    [AdminStudentCourseType.PRESENTIAL]: 'Presencial',
    [AdminStudentCourseType.ONLINE]: 'Online',
    [AdminStudentCourseType.NOT_ENROLLED]: 'Não inscrito',
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
                    <td>${formatDate(course.startDate)}</td>
                    <td>${formatDate(course.endDate)}</td>
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

async function getCoursesToExport(filters: AppliedFiltersState) {
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
    const [modality, setModality] = useState<Option[]>([]);
    const [draftLocations, setDraftLocations] = useState<Option[]>([]);
    const [draftDisabilityTypes, setDraftDisabilityTypes] = useState<Option[]>(
        [],
    );
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

    const { mutate: deleteCoursesMutation, isPending } = useDeleteAdminStudents(
        Object.keys(selectedCourses),
    );

    useEffect(() => {
        setSelectedCourses({});
    }, [isPending]);

    const courses = data?.data ?? [];
    const selectedCountLabel = `${Object.keys(selectedCourses).length} curso${
        Object.keys(selectedCourses).length === 1 ? '' : 's'
    } selecionado${Object.keys(selectedCourses).length === 1 ? '' : 's'}`;

    const handleExportAll = async () => {
        const printWindow = window.open('', '_blank', 'width=1120,height=840');
        setIsExporting(true);
        try {
            const courses = await getCoursesToExport(filters);
            if (courses.length === 0) {
                printWindow?.close();
                toast.info('Nenhum curso encontrado para exportar.');
                return;
            }
            exportCoursesToPdf(printWindow, courses, 'Gestão de Cursos');
        } catch {
            printWindow?.close();
            toast.error('Não foi possível exportar a lista de cursos.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleApplyAllFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            modality: modality.map((option) => String(option.value)),
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setModality([]);
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
            sortable: true,
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
            key: 'modality',
            header: 'Modalidade',
            sortable: true,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={
                        course.modality === AdminCourseModality.PRESENTIAL
                            ? 'PRESENCIAL'
                            : 'ONLINE'
                    }
                    className={
                        course.modality === AdminCourseModality.PRESENTIAL
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
            sortable: true,
        },
        {
            key: 'startDate',
            header: 'Data Inicial',
            sortable: true,
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
            sortable: true,
            render: (course: AdminCourseDto) => (
                <Chip
                    label={formatDateToBR(course.endDate)}
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
                >
                    <WhatsAppIcon fontSize='small' />
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
                    <ButtonComponent onClick={() => setShowCreateModal(true)}>
                        <span className='admin-courses__button-content'>
                            <AddRoundedIcon fontSize='small' />
                            Novo Curso
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleExportAll}
                    >
                        <span className='admin-courses__button-content'>
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar Lista
                        </span>
                    </ButtonComponent>
                </div>

                <div className='admin-courses__header-action'>
                    <ButtonComponent
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
                    </ButtonComponent>
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
                            placeholder='Buscar por nome, CPF, email...'
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
                            <MultSelect
                                placeholder='Selecione as modalidades'
                                options={courseTypeOptions}
                                value={modality}
                                onChange={(options) =>
                                    setModality([...(options ?? [])])
                                }
                                isSearchable
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

                        <button
                            type='button'
                            onClick={() => {
                                void deleteConfirmation(
                                    deleteCoursesMutation,
                                    Object.keys(selectedCourses),
                                );
                            }}
                        >
                            <DeleteOutlineRoundedIcon fontSize='small' />
                            Excluir selecionados
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
                onSuccess={() => {
                    setShowCreateModal(false);
                    toast.success('Curso cadastrado com sucesso.');
                }}
            />

            {!!selectedCourse && (
                <CourseModalWrapper
                    courseId={selectedCourse.id}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </section>
    );
}

function CourseModalWrapper({
    courseId,
    onClose,
}: {
    courseId?: string;
    onClose: () => void;
}) {
    const { data: course, isLoading } = useGetAdminCourseById(courseId);

    const DEFAULT_COURSE = {
        id: '',
        startDate: '',
        endDate: '',
        enrollmentStart: '',
        enrollmentEnd: '',
        title: '',
        description: '',
        modality: AdminCourseModality.ONLINE,
        location: '',
        workloadHours: 0,
        vacancyCount: 0,
        imageUrl: '',
        externalLink: '',
    };

    if (isLoading) return <LoadingModal isOpen={!!isLoading} />;

    return (
        <CourseModal
            isOpen={true}
            onClose={onClose}
            course={course ?? DEFAULT_COURSE}
        />
    );
}

function CourseModal({
    course,
    isOpen,
    onClose,
}: {
    course: AdminCourseDto;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [form, setForm] = useState<AdminCourseDto>({ ...course });

    function onTitleChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                title: newValue?.target?.value ?? '',
            };
        });
    }

    function onDescriptionChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                description: newValue?.target?.value ?? '',
            };
        });
    }

    function onModalityChange(newValue: Option | null) {
        if (!newValue) return;
        setForm((prevState: AdminCourseDto) => ({
            ...prevState,
            modality: newValue.value as AdminCourseModality,
        }));
    }

    function onStartDateChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                startDate: dateRegex(newValue?.target?.value ?? null) ?? '',
            };
        });
    }

    function onEndDateChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                endDate: dateRegex(newValue?.target?.value ?? null) ?? '',
            };
        });
    }

    function onStartEDateChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                enrollmentStart:
                    dateRegex(newValue?.target?.value ?? null) ?? '',
            };
        });
    }

    function onEndEDateChange(
        newValue: ChangeEvent<HTMLInputElement> | undefined,
    ) {
        setForm((prevState: AdminCourseDto) => {
            return {
                ...prevState,
                enrollmentEnd: dateRegex(newValue?.target?.value ?? null) ?? '',
            };
        });
    }

    return (
        <>
            <Dialog open={!!isOpen} onClose={onClose} fullWidth maxWidth='md'>
                <DialogTitle className='admin-courses__dialog-title'>
                    {!!course.id ? 'Editar Curso' : 'Novo Curso'}
                </DialogTitle>
                <DialogContent
                    dividers
                    className='admin-courses__dialog-content'
                >
                    <div className='admin-courses__details'>
                        <div className='admin-courses__details-header'>
                            <div>
                                <p className='field-label'>
                                    Nome <span className='required'>*</span>
                                </p>
                                <Input
                                    onChange={onTitleChange}
                                    value={form.title}
                                />
                            </div>

                            <div>
                                <p className='field-label'>
                                    Descrição{' '}
                                    <span className='required'>*</span>
                                </p>
                                <Input
                                    onChange={onDescriptionChange}
                                    value={form.description}
                                />
                            </div>

                            <div>
                                <p className='field-label'>
                                    Modalidade{' '}
                                    <span className='required'>*</span>
                                </p>
                                <Select
                                    placeholder=''
                                    defaultValue={courseTypeOptions[0]}
                                    options={courseTypeOptions}
                                    onChange={onModalityChange}
                                />
                            </div>
                        </div>

                        <section className='admin-courses__details-section'>
                            <div className='admin-courses__details-grid'>
                                <div>
                                    <p className='field-label'>
                                        Data Início{' '}
                                        <span className='required'>*</span>
                                    </p>
                                    <Input
                                        placeholder='dd/mm/aaaa'
                                        onChange={onStartDateChange}
                                        value={formatDateToBR(form.startDate)}
                                    />
                                </div>

                                <div>
                                    <p className='field-label'>
                                        Data Final{' '}
                                        <span className='required'>*</span>
                                    </p>
                                    <Input
                                        placeholder='dd/mm/aaaa'
                                        onChange={onEndDateChange}
                                        value={formatDateToBR(form.endDate)}
                                    />
                                </div>

                                <div>
                                    <p className='field-label'>
                                        Data Inicial Inscrições{' '}
                                        <span className='required'>*</span>
                                    </p>
                                    <Input
                                        placeholder='dd/mm/aaaa'
                                        onChange={onStartEDateChange}
                                        value={formatDateToBR(
                                            form.enrollmentStart,
                                        )}
                                    />
                                </div>

                                <div>
                                    <p className='field-label'>
                                        Data Final Inscrições{' '}
                                        <span className='required'>*</span>
                                    </p>
                                    <Input
                                        placeholder='dd/mm/aaaa'
                                        onChange={onEndEDateChange}
                                        value={formatDateToBR(
                                            form.enrollmentEnd,
                                        )}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </DialogContent>
                <DialogActions>
                    <ButtonComponent variant='secondary' onClick={onClose}>
                        Fechar
                    </ButtonComponent>
                </DialogActions>
            </Dialog>
        </>
    );
}
