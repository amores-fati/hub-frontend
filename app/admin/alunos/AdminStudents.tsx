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
} from '@/dtos/AdminStudentDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useDeleteAdminStudents } from '@/services/api/admin/students/mutations';
import { useGetAdminStudents } from '@/services/api/admin/students/queries';
import { useGetAdminLocations } from '@/services/api/admin/locations/queries';
import {
    downloadStudentsReport,
    ExportStudentsReportPayload,
    ReportFormat,
    StudentReportStatus,
} from '@/services/api/admin/reports';
import { ExportFormatModal } from '@/components/ExportFormatModal/ExportFormatModal';
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
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { ButtonComponent } from '@/components/base/Button/button';
import { useEffect, useMemo, useState } from 'react';
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
    [AdminStudentDisabilityType.MULTIPLE]: 'Múltipla',
    [AdminStudentDisabilityType.OTHER]: 'Outra',
};

const formatDisability = (
    disabilityType?: string,
): AdminStudentDisabilityType => {
    if (!disabilityType) return 'Não' as AdminStudentDisabilityType;
    return (
        disabilityType ? disabilityType : 'NENHUMA'
    ).toUpperCase() as AdminStudentDisabilityType;
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
    [Scholarship.NO_EDUCATION]: 'Sem escolaridade',
    [Scholarship.PRIMARY]: 'Ensino fundamental',
    [Scholarship.SECONDARY]: 'Ensino médio',
    [Scholarship.HIGHER]: 'Ensino superior',
    [Scholarship.POSTGRADUATE]: 'Pós-graduação',
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
        value: AdminStudentDisabilityType.OTHER,
        label: disabilityLabels[AdminStudentDisabilityType.OTHER],
    },
];

type AppliedFiltersState = Required<
    Pick<
        AdminStudentsQueryParams,
        'search' | 'modality' | 'disabilityType' | 'city'
    >
>;

const initialFiltersState: AppliedFiltersState = {
    search: '',
    modality: '',
    disabilityType: [],
    city: [],
};

const STUDENT_REPORT_LIMIT = 1000;

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
    if (!phone) return 'Não informado';
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

const buildWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    return `https://wa.me/55${phone.replace(/\D/g, '')}`;
};

const getBooleanLabel = (value?: boolean) =>
    value === undefined ? 'Não informado' : value ? 'Sim' : 'Não';

const getCourseBadgeClassName = (courseType: AdminStudentCourseType) => {
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

type StudentReportFilters = NonNullable<ExportStudentsReportPayload['filters']>;

const getFirstFilterValue = (values: string[]) =>
    values.find((value) => value.trim().length > 0);

const limitToSingleOption = (options: readonly Option[] | null | undefined) => {
    const lastOption = options?.at(-1);
    return lastOption ? [lastOption] : [];
};

const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const getUnsupportedStudentReportFilterMessage = (
    filters: AppliedFiltersState,
) => {
    const courseType = filters.modality;
    const disabilityType = getFirstFilterValue(filters.disabilityType);

    if (
        (courseType as AdminStudentCourseType) ===
            AdminStudentCourseType.PRESENTIAL ||
        (courseType as AdminStudentCourseType) === AdminStudentCourseType.ONLINE
    ) {
        return 'O relatório do backend ainda não suporta filtro por modalidade. Limpe esse filtro para exportar.';
    }

    if (disabilityType === AdminStudentDisabilityType.NONE) {
        return 'O relatório do backend ainda não suporta filtro por alunos sem PCD. Limpe esse filtro para exportar.';
    }

    return null;
};

const getStudentReportStatus = (
    courseType?: string,
): StudentReportStatus | undefined => {
    if (courseType === AdminStudentCourseType.NOT_ENROLLED) {
        return 'NAO_INSCRITO';
    }

    return undefined;
};

const buildStudentReportFilters = (
    filters: AppliedFiltersState,
): StudentReportFilters | undefined => {
    const reportFilters: StudentReportFilters = {};
    const search = filters.search.trim();
    const location = getFirstFilterValue(filters.city);
    const disabilityType = getFirstFilterValue(filters.disabilityType);
    const status = getStudentReportStatus(filters.modality);

    if (search) reportFilters.search = search;
    if (location) reportFilters.location = location;
    if (disabilityType) reportFilters.pcdType = disabilityType;
    if (status) reportFilters.status = status;

    return Object.keys(reportFilters).length ? reportFilters : undefined;
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
        (s: State<AdminStudentDto> & Action<AdminStudentDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<AdminStudentDto> & Action<AdminStudentDto>) => s.setContent,
    );
    const selectedStudents = useTableStore((state) => state.selectedRows);
    const setSelectedStudents = useTableStore((state) => state.setSelectedRows);

    const [searchInput, setSearchInput] = useState('');
    const [draftCourseTypes, setDraftCourseTypes] = useState<Option[]>([]);
    const [draftLocations, setDraftLocations] = useState<Option[]>([]);
    const [draftDisabilityTypes, setDraftDisabilityTypes] = useState<Option[]>(
        [],
    );
    const [filters, setFilters] =
        useState<AppliedFiltersState>(initialFiltersState);
    const [selectedStudent, setSelectedStudent] =
        useState<AdminStudentDto | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingSelected, setIsExportingSelected] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState<
        'all' | 'selected' | null
    >(null);

    const { data: locationsData } = useGetAdminLocations({ scope: 'STUDENT' });

    const locationOptions = useMemo(() => {
        return (locationsData ?? []).map((loc) => ({
            value: `${loc.city}/${loc.uf}`,
            label: `${loc.city}/${loc.uf}`,
        }));
    }, [locationsData]);

    const getParameters = (): AdminStudentsQueryParams => {
        return {
            page: paginator.page,
            limit: paginator.rowsPerPage,
            search: filters.search || undefined,
            modality: filters.modality,
            disabilityType: filters.disabilityType,
            city: filters.city,
            sortBy: paginator.orderColumn,
            sortOrder: paginator.orderDirection,
        };
    };

    const { data, isLoading, isFetching, isError } =
        useGetAdminStudents(getParameters());

    useEffect(() => {
        if (isLoading || isFetching) setIsLoading(true);
    }, [isLoading, isFetching]);

    useEffect(() => {
        if (!data || !data?.items) return;
        setContent(data.items);
        setPaginator({
            itemsCount: data.meta.total,
        });
        setIsLoading(false);
    }, [data, isLoading, isFetching]);

    const { mutate: deleteStudentsMutation, isPending } =
        useDeleteAdminStudents();

    useEffect(() => {
        setSelectedStudents({});
    }, [isPending]);

    const students = data?.items ?? [];
    const totalStudents = data?.meta.total ?? 0;
    const selectedCountLabel = `${Object.keys(selectedStudents).length} aluno${
        Object.keys(selectedStudents).length === 1 ? '' : 's'
    } selecionado${Object.keys(selectedStudents).length === 1 ? '' : 's'}`;

    const handleExportAll = async (format: ReportFormat) => {
        const unsupportedFilterMessage =
            getUnsupportedStudentReportFilterMessage(filters);

        if (unsupportedFilterMessage) {
            toast.info(unsupportedFilterMessage);
            return;
        }

        if (totalStudents > STUDENT_REPORT_LIMIT) {
            toast.info(
                `O relatório permite até ${STUDENT_REPORT_LIMIT} alunos. Refine os filtros antes de exportar.`,
            );
            return;
        }

        setIsExporting(true);
        try {
            await downloadStudentsReport(
                { mode: 'all', filters: buildStudentReportFilters(filters) },
                format,
            );
            setExportModalOpen(null);
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    'Não foi possível exportar a lista de alunos.',
                ),
            );
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportSelected = async (format: ReportFormat) => {
        const selectedIds = Object.keys(selectedStudents);

        if (selectedIds.length === 0) {
            toast.info('Selecione pelo menos um aluno para exportar.');
            return;
        }

        if (selectedIds.length > STUDENT_REPORT_LIMIT) {
            toast.info(
                `O relatório permite até ${STUDENT_REPORT_LIMIT} alunos selecionados.`,
            );
            return;
        }

        setIsExportingSelected(true);
        try {
            await downloadStudentsReport(
                { mode: 'selected', ids: selectedIds },
                format,
            );
            setExportModalOpen(null);
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    'Não foi possível exportar os alunos selecionados.',
                ),
            );
        } finally {
            setIsExportingSelected(false);
        }
    };

    const handleExportWithFormat = (format: ReportFormat) => {
        if (exportModalOpen === 'all') void handleExportAll(format);
        else if (exportModalOpen === 'selected')
            void handleExportSelected(format);
    };

    const handleApplyAllFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            modality: draftCourseTypes.map((option) => String(option.value))[0],
            city: draftLocations.map((option) => String(option.value)),
            disabilityType: draftDisabilityTypes.map((option) =>
                String(option.value),
            ),
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setDraftCourseTypes([]);
        setDraftLocations([]);
        setDraftDisabilityTypes([]);
        setPaginator({ page: 1 });
        setFilters(initialFiltersState);
    };

    // key: keyof (T & { id: number | string; });
    // name: string;
    // type: CellType;
    // // type: CellType;
    // component?: (row: T & { id: number | string; }) => ReactNode;
    // sortable: boolean;

    const cells: Cells<AdminStudentDto>[] = [
        {
            key: 'id',
            header: '',
            type: CellType.CHECKBOX,
            sortable: false,
        },
        {
            key: 'fullName',
            header: 'Nome',
            type: CellType.TEXT,
            sortable: true,
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
            render: (student: AdminStudentDto) => (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(Array.isArray(student.enrollmentStatus)
                        ? student.enrollmentStatus
                        : [
                              student.enrollmentStatus ??
                                  AdminStudentCourseType.NOT_ENROLLED,
                          ]
                    ).map((status) => (
                        <Chip
                            key={status}
                            label={courseTypeLabels[status]}
                            className={getCourseBadgeClassName(status)}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: 'phoneNumber',
            header: 'Contato',
            sortable: true,
            render: (student: AdminStudentDto) => (
                <div className='admin-students__meta-cell'>
                    <span>{student.email}</span>
                    <small>
                        <a
                            href={buildWhatsAppLink(student.phoneNumber)}
                            target='_blank'
                            rel='noreferrer'
                            className='admin-students__contact-link'
                        >
                            {formatPhone(student.phoneNumber)}
                        </a>
                    </small>
                </div>
            ),
        },
        {
            key: 'city',
            header: 'Localização',
            sortable: true,
            render: (student: AdminStudentDto) => (
                <>
                    {normalizeText(student.city)}/{student.state}
                </>
            ),
        },
        {
            key: 'isPcd',
            header: 'PCD',
            sortable: true,
            render: (student: AdminStudentDto) => {
                const disabilities = student.disabilityType
                    ? student.disabilityType.split(',').map((d) => d.trim())
                    : [];
                return disabilities.map((disability) => (
                    <Chip
                        key={disability}
                        label={
                            disabilityLabels[formatDisability(disability)] ??
                            disabilityLabels[AdminStudentDisabilityType.OTHER]
                        }
                        className={getDisabilityBadgeClassName(student)}
                    />
                ));
            },
        },
        {
            key: 'actions',
            header: 'Ações',
            sortable: false,
            render: (student: AdminStudentDto) => (
                <>
                    <IconButton
                        className='custom-table__action-button'
                        component='a'
                        href={buildWhatsAppLink(student.phoneNumber)}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <WhatsAppIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        className='custom-table__action-button'
                        component='a'
                        href={`/admin/curriculo?studentId=${student.id}`}
                    >
                        <AssignmentIndIcon fontSize='small' />
                    </IconButton>
                </>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

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
                        onClick={() => setExportModalOpen('all')}
                        disabled={isExporting || isLoading}
                    >
                        <span className='admin-students__button-content'>
                            {isExporting ? (
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

                <small className='admin-students__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

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
                                placeholder='Selecione uma modalidade'
                                options={courseTypeOptions}
                                value={draftCourseTypes}
                                onChange={(options) =>
                                    setDraftCourseTypes(
                                        limitToSingleOption(options),
                                    )
                                }
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-students__field-label'>
                                Localização
                            </label>
                            <MultSelect
                                placeholder='Selecione uma cidade'
                                options={locationOptions}
                                value={draftLocations}
                                onChange={(options) =>
                                    setDraftLocations(
                                        limitToSingleOption(options),
                                    )
                                }
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-students__field-label'>
                                Status PCD
                            </label>
                            <MultSelect
                                placeholder='Selecione um status'
                                options={disabilityOptions}
                                value={draftDisabilityTypes}
                                onChange={(options) =>
                                    setDraftDisabilityTypes([
                                        ...limitToSingleOption(options),
                                    ])
                                }
                                isClearable
                                isSearchable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {Object.keys(selectedStudents).length > 0 && (
                <div className='admin-students__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='admin-students__bulk-actions'>
                        <button
                            type='button'
                            onClick={() => setExportModalOpen('selected')}
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
                                void deleteConfirmation(
                                    deleteStudentsMutation,
                                    Object.keys(selectedStudents),
                                );
                            }}
                        >
                            <DeleteOutlineRoundedIcon fontSize='small' />
                            Excluir selecionados
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
                        <BasicTable />
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
                                                    selectedStudent
                                                        .enrollmentStatus[0] ??
                                                        AdminStudentCourseType.NOT_ENROLLED
                                                ]
                                            }
                                            className={getCourseBadgeClassName(
                                                selectedStudent
                                                    .enrollmentStatus[0] ??
                                                    AdminStudentCourseType.NOT_ENROLLED,
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
                                            {formatPhone(
                                                selectedStudent.phoneNumber,
                                            )}
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
                                            {selectedStudent.course ||
                                                'Não inscrito'}
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

            <ExportFormatModal
                open={exportModalOpen !== null}
                loading={isExporting || isExportingSelected}
                onClose={() => setExportModalOpen(null)}
                onExport={handleExportWithFormat}
            />
        </section>
    );
}
