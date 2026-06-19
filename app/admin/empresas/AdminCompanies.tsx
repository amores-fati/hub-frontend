'use client';

import { Input } from '@/components/base';
import { ButtonComponent } from '@/components/base/Button/button';
import BasicTable from '@/components/base/Table2/table';
import { Cells, CellType } from '@/components/base/Table2/types';
import { ExportFormatModal } from '@/components/ExportFormatModal/ExportFormatModal';
import {
    AdminCompanyDto,
    AdminCompanyStatus,
    AdminCompaniesQueryParams,
} from '@/dtos/AdminCompanyDto';
import { useGetAdminCompanies } from '@/services/api/admin/companies/queries';
import { useGetAdminLocations } from '@/services/api/admin/locations/queries';
import {
    downloadCompaniesReport,
    ExportCompaniesReportPayload,
    ReportFormat,
} from '@/services/api/admin/reports';
import {
    Action,
    State,
    TableStoreProvider,
    useTableStore,
} from '@/stores/TableStoreProvider';
import {
    EditOutlined as EditOutlinedIcon,
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    FilterListRounded as FilterListRoundedIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
    KeyboardArrowUpRounded as KeyboardArrowUpRoundedIcon,
    RestartAltRounded as RestartAltRoundedIcon,
    SearchRounded as SearchRoundedIcon,
} from '@mui/icons-material';
import { Collapse, IconButton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

const COMPANY_REPORT_LIMIT = 1000;

type AppliedFilters = {
    search: string;
    state: string;
    city: string;
    status: '' | AdminCompanyStatus;
};

const initialFilters: AppliedFilters = {
    search: '',
    state: '',
    city: '',
    status: '',
};

type CompanyReportFilters = NonNullable<
    ExportCompaniesReportPayload['filters']
>;

const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const buildCompanyFilters = (
    filters: AppliedFilters,
): CompanyReportFilters | undefined => {
    const reportFilters: CompanyReportFilters = {};
    const search = filters.search.trim();

    if (search) reportFilters.search = search;
    if (filters.status) reportFilters.status = filters.status;
    if (filters.state) reportFilters.state = filters.state;
    if (filters.city) reportFilters.city = filters.city;

    return Object.keys(reportFilters).length ? reportFilters : undefined;
};

export default function Index() {
    return (
        <TableStoreProvider>
            <AdminCompanies />
        </TableStoreProvider>
    );
}

function AdminCompanies() {
    const paginator = useTableStore((state) => ({ ...state.paginator }));
    const setPaginator = useTableStore((state) => state.setPaginator);
    const setIsLoading = useTableStore((state) => state.setIsLoading);
    const setCells = useTableStore(
        (s: State<AdminCompanyDto> & Action<AdminCompanyDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<AdminCompanyDto> & Action<AdminCompanyDto>) => s.setContent,
    );
    const selectedCompanies = useTableStore(
        (state) => state.selectedRows,
    ) as Record<string, AdminCompanyDto>;
    const setSelectedCompanies = useTableStore(
        (state) => state.setSelectedRows,
    );

    const [searchInput, setSearchInput] = useState('');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [draftState, setDraftState] = useState('');
    const [draftCity, setDraftCity] = useState('');
    const [draftStatus, setDraftStatus] = useState<'' | AdminCompanyStatus>('');
    const [filters, setFilters] = useState<AppliedFilters>(initialFilters);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const { data: locationsData } = useGetAdminLocations({ scope: 'COMPANY' });

    const stateOptions = useMemo(() => {
        return [...new Set((locationsData ?? []).map((location) => location.uf))]
            .filter(Boolean)
            .sort();
    }, [locationsData]);

    const cityOptions = useMemo(() => {
        return (locationsData ?? [])
            .filter((location) => !draftState || location.uf === draftState)
            .map((location) => location.city)
            .filter((city, index, cities) => cities.indexOf(city) === index)
            .sort();
    }, [draftState, locationsData]);

    const queryParams: AdminCompaniesQueryParams = {
        page: paginator.page,
        limit: paginator.rowsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        state: filters.state || undefined,
        city: filters.city || undefined,
    };

    const { data, isError, isFetching, isLoading } =
        useGetAdminCompanies(queryParams);

    const totalCompanies = data?.total ?? 0;
    const companies = data?.data ?? [];
    const selectedCount = Object.keys(selectedCompanies).length;

    useEffect(() => {
        if (isLoading || isFetching) setIsLoading(true);
    }, [isFetching, isLoading, setIsLoading]);

    useEffect(() => {
        if (!data) return;
        setContent(data.data);
        setPaginator({
            itemsCount: data.total,
            isLoading: false,
        });
    }, [data, setContent, setPaginator]);

    useEffect(() => {
        if (!isError) return;
        setContent([]);
        setPaginator({ itemsCount: 0, isLoading: false });
    }, [isError, setContent, setPaginator]);

    const handleEdit = () => {
        toast.info('Funcionalidade disponivel em breve.');
    };

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
                : { mode: 'all', filters: buildCompanyFilters(filters) };

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

    const applyFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            state: draftState,
            city: draftCity,
            status: draftStatus,
        });
        setSelectedCompanies({});
    };

    const clearFilters = () => {
        setSearchInput('');
        setDraftState('');
        setDraftCity('');
        setDraftStatus('');
        setFilters(initialFilters);
        setSelectedCompanies({});
        setPaginator({ page: 1 });
        setAdvancedOpen(false);
    };

    const handleStateChange = (state: string) => {
        setDraftState(state);
        setDraftCity('');
    };

    const cells: Cells<AdminCompanyDto>[] = [
        { key: 'id', header: '', type: CellType.CHECKBOX, sortable: false },
        {
            key: 'name',
            header: 'EMPRESA',
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
            key: 'email',
            header: 'EMAIL',
            sortable: false,
            render: (company) => (
                <span className='ac__contact-email'>{company.email}</span>
            ),
        },
        {
            key: 'responsibleName',
            header: 'RESPONSAVEL',
            sortable: false,
        },
        {
            key: 'status',
            header: 'STATUS',
            sortable: false,
            render: (company) => (
                <span
                    className={`ac__status ac__status--${company.status === 'ATIVO' ? 'active' : 'inactive'}`}
                >
                    {company.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'ACOES',
            sortable: false,
            render: () => (
                <IconButton onClick={handleEdit} size='small'>
                    <EditOutlinedIcon sx={{ fontSize: 16, color: '#1d1d1d' }} />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    return (
        <section className='ac'>
            <div className='ac__header'>
                <div>
                    <span className='ac__eyebrow'>Area administrativa</span>
                    <h1>Gestao de Empresas</h1>
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

            <div className='ac__filters-card'>
                <div className='ac__search-row'>
                    <div className='ac__search-input'>
                        <Input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') applyFilters();
                            }}
                            placeholder='Buscar por razao social, CNPJ, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>
                    <ButtonComponent onClick={applyFilters} disabled={isLoading}>
                        <span className='ac__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>
                    <ButtonComponent variant='secondary' onClick={clearFilters}>
                        <span className='ac__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <small className='ac__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

                <button
                    type='button'
                    className='ac__advanced-toggle'
                    onClick={() => setAdvancedOpen((value) => !value)}
                >
                    <span>
                        <FilterListRoundedIcon fontSize='small' />
                        Filtros avancados
                    </span>
                    {advancedOpen ? (
                        <KeyboardArrowUpRoundedIcon fontSize='small' />
                    ) : (
                        <KeyboardArrowDownRoundedIcon fontSize='small' />
                    )}
                </button>

                <Collapse in={advancedOpen}>
                    <div className='ac__advanced-grid'>
                        <div>
                            <label className='ac__field-label'>UF</label>
                            <select
                                className='ac__field-select'
                                value={draftState}
                                onChange={(event) =>
                                    handleStateChange(event.target.value)
                                }
                            >
                                <option value=''>Todas as UFs</option>
                                {stateOptions.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='ac__field-label'>Cidade</label>
                            <select
                                className='ac__field-select'
                                value={draftCity}
                                onChange={(event) =>
                                    setDraftCity(event.target.value)
                                }
                                disabled={!draftState}
                            >
                                <option value=''>
                                    {draftState
                                        ? 'Todas as cidades'
                                        : 'Selecione uma UF primeiro'}
                                </option>
                                {cityOptions.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='ac__field-label'>
                                Status da empresa
                            </label>
                            <select
                                className='ac__field-select'
                                value={draftStatus}
                                onChange={(event) =>
                                    setDraftStatus(
                                        event.target.value as
                                            | ''
                                            | AdminCompanyStatus,
                                    )
                                }
                            >
                                <option value=''>Todos</option>
                                <option value='ATIVO'>Ativo</option>
                                <option value='INATIVO'>Inativo</option>
                            </select>
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedCount > 0 && (
                <div className='ac__bulk-bar'>
                    <strong>
                        {selectedCount} empresa{selectedCount !== 1 ? 's' : ''}{' '}
                        selecionada{selectedCount !== 1 ? 's' : ''}
                    </strong>
                    <div className='ac__bulk-actions'>
                        <button
                            type='button'
                            onClick={() => setExportModalOpen(true)}
                            disabled={isExporting}
                        >
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar selecionados
                        </button>
                    </div>
                </div>
            )}

            <div className='ac__table-card'>
                {isError ? (
                    <div className='ac__empty'>
                        Nao foi possivel carregar as empresas.
                    </div>
                ) : companies.length === 0 && !isLoading && !isFetching ? (
                    <div className='ac__empty'>
                        Nenhuma empresa encontrada com os filtros aplicados.
                    </div>
                ) : (
                    <BasicTable<AdminCompanyDto> />
                )}
            </div>

            <ExportFormatModal
                formats={['xlsx']}
                open={exportModalOpen}
                loading={isExporting}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExportWithFormat}
            />
        </section>
    );
}
