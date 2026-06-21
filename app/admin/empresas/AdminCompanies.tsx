'use client';

import { Input, Loading, MultSelect, Select } from '@/components/base';
import {
    AdminStudentCourseType,
    AdminStudentDisabilityType,
    AdminStudentsQueryParams,
} from '@/dtos/AdminStudentDto';
import { useGetAdminLocations } from '@/services/api/admin/locations/queries';
import {
    downloadCompaniesReport,
    ExportCompaniesReportPayload,
    ExportStudentsReportPayload,
    ReportFormat,
    StudentReportStatus,
} from '@/services/api/admin/reports';
import { ExportFormatModal } from '@/components/ExportFormatModal/ExportFormatModal';
import { Option } from '@/components/base/Select/select';
import { Chip, CircularProgress, Collapse } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
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
import { AdminCompanyDto } from '@/dtos/AdminCompanyDto';
import { useGetAdminCompanies } from '@/services/api/admin/companies/queries';

const COMPANY_REPORT_LIMIT = 1000;

const getStatusBadgeClass = (status: 'ATIVO' | 'INATIVO') =>
    status === 'ATIVO'
        ? 'admin-companies__badge admin-companies__badge--ativo'
        : 'admin-companies__badge admin-companies__badge--inativo';

const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

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

const normalizeText = (value?: string | null) =>
    (value ?? '')
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .trim();

const formatLocation = (city?: string | null, state?: string | null) => {
    const normalizedCity = normalizeText(city);
    const normalizedState = state?.trim();

    if (normalizedCity && normalizedState) {
        return `${normalizedCity}/${normalizedState}`;
    }

    return normalizedCity || normalizedState || 'Nao informado';
};

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

const getBooleanLabel = (value?: string) =>
    value === 'ATIVO' ? 'Sim' : value === 'INATIVO' ? 'Não' : 'Não informado';

type StudentReportFilters = NonNullable<ExportStudentsReportPayload['filters']>;

const getFirstFilterValue = (values: string[]) =>
    values.find((value) => value.trim().length > 0);

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
        (s: State<AdminCompanyDto> & Action<AdminCompanyDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<AdminCompanyDto> & Action<AdminCompanyDto>) => s.setContent,
    );
    const selectedCompanies = useTableStore((state) => state.selectedRows);
    const setSelectedCompanies = useTableStore(
        (state) => state.setSelectedRows,
    );

    const [searchInput, setSearchInput] = useState('');
    const [draftCourseTypes, setDraftCourseTypes] = useState<Option | null>(
        null,
    );
    const [draftLocations, setDraftLocations] = useState<Option[]>([]);
    const [draftDisabilityTypes, setDraftDisabilityTypes] = useState<Option[]>(
        [],
    );
    const [filters, setFilters] =
        useState<AppliedFiltersState>(initialFiltersState);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingSelected, setIsExportingSelected] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

    const { data: locationsData } = useGetAdminLocations({ scope: 'COMPANY' });

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
            city: filters.city,
            sortBy: paginator.orderColumn,
            sortOrder: paginator.orderDirection,
        };
    };

    const { data, isError, isFetching, isLoading } =
        useGetAdminCompanies(getParameters());

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

    const companies = data?.data ?? [];
    const totalCompanies = data?.total ?? 0;
    const selectedCountLabel = `${Object.keys(selectedCompanies).length} empresa${
        Object.keys(selectedCompanies).length === 1 ? '' : 's'
    } selecionada${Object.keys(selectedCompanies).length === 1 ? '' : 's'}`;

    const handleExportWithFormat = async (format: ReportFormat) => {
        if (format !== 'xlsx') return;

        const selectedIds = Object.keys(selectedCompanies);

        if (selectedIds.length > COMPANY_REPORT_LIMIT) {
            toast.info(
                `O relatorio permite ate ${COMPANY_REPORT_LIMIT} empresas selecionadas.`,
            );
            return;
        }

        if (selectedIds.length === 0 && totalCompanies > COMPANY_REPORT_LIMIT) {
            toast.info(
                `O relatorio permite ate ${COMPANY_REPORT_LIMIT} empresas. Refine os filtros antes de exportar.`,
            );
            return;
        }

        const payload: ExportCompaniesReportPayload =
            selectedIds.length > 0
                ? { mode: 'selected', ids: selectedIds }
                : { mode: 'all', filters: getParameters() };

        setIsExporting(true);
        try {
            await downloadCompaniesReport(payload, 'xlsx');
            setExportModalOpen(false);
        } catch (error) {
            toast.error(
                getErrorMessage(error, 'Nao foi possivel exportar empresas.'),
            );
        } finally {
            setIsExporting(false);
        }
    };

    const handleApplyAllFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            modality: draftCourseTypes ? String(draftCourseTypes.value) : '',
            city: draftLocations.map((option) => String(option.value)),
            disabilityType: draftDisabilityTypes.map((option) =>
                String(option.value),
            ),
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setDraftCourseTypes(null);
        setDraftLocations([]);
        setDraftDisabilityTypes([]);
        setPaginator({ page: 1 });
        setFilters(initialFiltersState);
    };

    const cells: Cells<AdminCompanyDto>[] = [
        { key: 'id', header: '', type: CellType.CHECKBOX, sortable: false },
        {
            key: 'name',
            header: 'Empresa',
            sortable: false,
            render: (company) => (
                <div className='ac__company-cell'>
                    <div className='ac__avatar'>
                        {getInitials(company.name)}
                    </div>
                    <span className='ac__company-name'>{company.name}</span>
                </div>
            ),
        },
        { key: 'cnpj', header: 'CNPJ', sortable: false },
        {
            key: 'city',
            header: 'Cidade',
            sortable: false,
            render: (company) => formatLocation(company.city, company.state),
        },
        {
            key: 'email',
            header: 'Email',
            sortable: false,
            render: (company) => (
                <span className='ac__contact-email'>{company.email}</span>
            ),
        },
        {
            key: 'responsibleName',
            header: 'Responsável',
            sortable: false,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: false,
            render: (company) => (
                <Chip
                    label={company.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                    className={getStatusBadgeClass(company.status)}
                />
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    return (
        <section className='admin-companies'>
            <div className='admin-companies__header'>
                <div>
                    <span className='admin-companies__eyebrow'>
                        Area administrativa
                    </span>
                    <h1>Gestão de Empresas</h1>
                </div>

                <div className='ac__header-action'>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setExportModalOpen(true)}
                        disabled={isExporting || isLoading}
                    >
                        <span className='ac__button-content'>
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar XLSX
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            <div className='admin-companies__filters-card'>
                <div className='admin-companies__search-row'>
                    <div className='admin-companies__search-input'>
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
                            placeholder='Buscar por nome, CNPJ, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent
                        onClick={handleApplyAllFilters}
                        disabled={isLoading}
                    >
                        <span className='admin-companies__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleClearFilters}
                    >
                        <span className='admin-companies__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <small className='admin-companies__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

                <button
                    className='admin-companies__advanced-toggle'
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
                    <div className='admin-companies__advanced-grid'>
                        <div>
                            <label className='admin-companies__field-label'>
                                Modalidade do curso
                            </label>
                            <Select
                                placeholder='Selecione uma modalidade'
                                options={courseTypeOptions}
                                defaultValue={draftCourseTypes ?? undefined}
                                onChange={(e) => setDraftCourseTypes(e)}
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-companies__field-label'>
                                Localização
                            </label>
                            <MultSelect
                                placeholder='Selecione uma cidade'
                                options={locationOptions}
                                value={draftLocations}
                                onChange={(options) =>
                                    setDraftLocations(
                                        options ? (options as Option[]) : [],
                                    )
                                }
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='admin-companies__field-label'>
                                Status PCD
                            </label>
                            <MultSelect
                                placeholder='Selecione um status'
                                options={disabilityOptions}
                                value={draftDisabilityTypes}
                                onChange={(options) =>
                                    setDraftDisabilityTypes(
                                        options ? (options as Option[]) : [],
                                    )
                                }
                                isClearable
                                isSearchable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {Object.keys(selectedCompanies).length > 0 && (
                <div className='admin-companies__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='admin-companies__bulk-actions'>
                        <button
                            type='button'
                            onClick={() => setExportModalOpen(true)}
                            disabled={isExportingSelected}
                        >
                            {isExportingSelected ? (
                                <CircularProgress size={14} />
                            ) : (
                                <PictureAsPdfRoundedIcon fontSize='small' />
                            )}
                            Exportar selecionados
                        </button>
                    </div>
                </div>
            )}

            <div className='admin-companies__table-card'>
                {isLoading && !data ? (
                    <div className='admin-companies__loading-state'>
                        <Loading />
                    </div>
                ) : isError ? (
                    <div className='admin-companies__empty-state'>
                        <span className='admin-companies__eyebrow'>
                            Erro ao carregar
                        </span>
                        <h2>Não foi possível carregar as empresas.</h2>
                    </div>
                ) : companies.length === 0 ? (
                    <div className='admin-companies__empty-state'>
                        <h2>
                            Nenhuma empresa encontrada com os filtros aplicados.
                        </h2>
                        <p>Tente ajustar a busca ou limpar os filtros.</p>
                    </div>
                ) : (
                    <>
                        <BasicTable />
                    </>
                )}
            </div>

            <ExportFormatModal
                open={exportModalOpen}
                loading={isExporting || isExportingSelected}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExportWithFormat}
                formats={['xlsx']}
            />
        </section>
    );
}
