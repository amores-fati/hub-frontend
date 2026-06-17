'use client';

import { Input, MultSelect, Select } from '@/components/base';
import {
    VacanciesQueryParams,
    VacancyDto,
    WorkplaceType,
} from '@/dtos/VacancyDto';
import { Option } from '@/components/base/Select/select';
import { Chip, Collapse, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ButtonComponent } from '@/components/base/Button/button';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
    useGetCompanyJobOpening,
    useGetCompanyVacancies,
} from '@/services/api/companies/vacancies/queries';
import { useDeleteVacancy } from '@/services/api/companies/vacancies/mutations';
import { VacancyModal } from './VacancyModal';
import {
    Action,
    State,
    TableStoreProvider,
    useTableStore,
} from '@/stores/TableStoreProvider';
import { Cells, CellType } from '@/components/base/Table2/types';
import BasicTable from '@/components/base/Table2/table';
import './index.scss';
import LoadingModal from '../../../components/Modal';
import { deleteConfirmation } from './Swal';

const workplaceTypeLabels: Record<WorkplaceType, string> = {
    [WorkplaceType.PRESENTIAL]: 'Presencial',
    [WorkplaceType.ONLINE]: 'Online',
    [WorkplaceType.HYBRID]: 'Híbrido',
};

const workplaceTypeOptions: Option[] = [
    {
        value: WorkplaceType.PRESENTIAL,
        label: workplaceTypeLabels[WorkplaceType.PRESENTIAL],
    },
    {
        value: WorkplaceType.ONLINE,
        label: workplaceTypeLabels[WorkplaceType.ONLINE],
    },
    {
        value: WorkplaceType.HYBRID,
        label: workplaceTypeLabels[WorkplaceType.HYBRID],
    },
];

const pcdOptions: Option[] = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
];

const formatAnnouncementDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

type FiltersState = {
    search: string;
    isPcd: string | null;
    workplaceType: string | null;
};

const initialFilters: FiltersState = {
    search: '',
    isPcd: null,
    workplaceType: null,
};

export function CompanyVacancies() {
    return (
        <TableStoreProvider>
            <CompanyVacanciesContent />
        </TableStoreProvider>
    );
}

function CompanyVacanciesContent() {
    const [searchInput, setSearchInput] = useState('');
    const [draftPcd, setDraftPcd] = useState<Option | null>(null);
    const [draftWorkplaceType, setDraftWorkplaceType] = useState<Option | null>(
        null,
    );
    const [filters, setFilters] = useState<FiltersState>(initialFilters);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const [selectedVacancy, setSelectedVacancy] = useState<{
        vacancy: VacancyDto | null;
        mode: 'view' | 'edit';
    }>({ vacancy: null, mode: 'view' });
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

    const paginator = useTableStore((s) => ({ ...s.paginator }));
    const setPaginator = useTableStore((s) => s.setPaginator);
    const setIsLoading = useTableStore((s) => s.setIsLoading);
    const setCells = useTableStore(
        (s: State<VacancyDto> & Action<VacancyDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<VacancyDto> & Action<VacancyDto>) => s.setContent,
    );
    const selectedRows = useTableStore((s) => s.selectedRows);
    const setSelectedRows = useTableStore((s) => s.setSelectedRows);

    const hasFilters = Boolean(
        filters.search || filters.isPcd || filters.workplaceType,
    );

    const selectedCount = Object.keys(selectedRows).length;
    const selectedCountLabel = `${selectedCount} vaga${selectedCount === 1 ? '' : 's'} selecionada${selectedCount === 1 ? '' : 's'}`;

    const queryParams = useMemo<VacanciesQueryParams>(
        () => ({
            page: paginator.page,
            limit: paginator.rowsPerPage,
            search: filters.search || undefined,
            isPcd: filters.isPcd === 'true' ? true : filters.isPcd === 'false' ? false : undefined,
            workplaceType: filters.workplaceType ?? null,
        }),
        [filters, paginator.page, paginator.rowsPerPage],
    );

    const { data, isLoading, isFetching, isError } =
        useGetCompanyVacancies(queryParams);

    const { mutate: deleteVacancyMutation } = useDeleteVacancy();

    useEffect(() => {
        if (isLoading || isFetching) {
            setIsLoading(true);
            return;
        }
        if (data) {
            setContent(data.data);
            setPaginator({ itemsCount: data.total });
        }
        setIsLoading(false);
    }, [data, isLoading, isFetching]);

    useEffect(() => {
        setSelectedRows({});
    }, [filters, paginator.page]);

    const handleApplyFilters = () => {
        setPaginator({ page: 1 });
        setSelectedRows({});
        setFilters({
            search: searchInput.trim(),
            isPcd: draftPcd ? String(draftPcd.value) : null,
            workplaceType: draftWorkplaceType ? String(draftWorkplaceType.value) : null,
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setDraftPcd(null);
        setDraftWorkplaceType(null);
        setPaginator({ page: 1 });
        setFilters(initialFilters);
        setSelectedRows({});
    };

    const cells: Cells<VacancyDto>[] = [
        { key: 'id', header: '', type: CellType.CHECKBOX, sortable: false },
        {
            key: 'name',
            header: 'Nome',
            sortable: false,
            render: (v) => (
                <span className='company-vacancies__vacancy-name'>
                    {v.name}
                </span>
            ),
        },
        {
            key: 'description',
            header: 'Descrição',
            sortable: false,
            render: (v) => (
                <span className='company-vacancies__vacancy-name'>
                    {v.description}
                </span>
            ),
        },
        {
            key: 'openingsCount',
            header: 'Número de Vagas',
            sortable: false,
            render: (v) => v.openingsCount,
        },
        {
            key: 'isPcd',
            header: 'Exclusivo PCD',
            sortable: false,
            render: (v) => (
                <Chip
                    label={v.isPcd ? 'SIM' : 'NÃO'}
                    className={`company-vacancies__badge company-vacancies__badge--${v.isPcd ? 'success' : 'danger'}`}
                />
            ),
        },
        {
            key: 'announcementDate',
            header: 'Data de Anúncio',
            sortable: false,
            render: (v) => (
                <Chip
                    label={formatAnnouncementDate(v.announcementDate)}
                    className='company-vacancies__badge company-vacancies__badge--date'
                />
            ),
        },
        {
            key: 'workplaceType',
            header: 'Tipo',
            sortable: false,
            render: (v) =>
                v.workplaceType ? (
                    <Chip
                        label={workplaceTypeLabels[v.workplaceType]}
                        className={`company-vacancies__badge company-vacancies__badge--workplace-${v.workplaceType}`}
                    />
                ) : (
                    <span className='company-vacancies__empty-cell'>—</span>
                ),
        },
        {
            key: 'actions',
            header: 'Ações',
            sortable: false,
            render: (v) => (
                <div className='custom-table__actions'>
                    <IconButton
                        className='custom-table__action-button'
                        onClick={() =>
                            setSelectedVacancy({ vacancy: v, mode: 'view' })
                        }
                    >
                        <VisibilityOutlinedIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        className='custom-table__action-button'
                        onClick={() =>
                            setSelectedVacancy({ vacancy: v, mode: 'edit' })
                        }
                    >
                        <EditOutlinedIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        className='custom-table__action-button custom-table__action-button--danger'
                        onClick={() => {
                            void deleteConfirmation(deleteVacancyMutation, v.id);
                        }}
                    >
                        <DeleteOutlineRoundedIcon fontSize='small' />
                    </IconButton>
                </div>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    const isBusy = isLoading || isFetching;
    const vacancies = data?.data ?? [];
    const isEmpty = !isBusy && vacancies.length === 0;

    return (
        <section className='company-vacancies'>
            <div className='company-vacancies__header'>
                <div>
                    <h1>Gestão de Vagas</h1>
                    <p>
                        Administração centralizada de{' '}
                        <a
                            href='#'
                            className='company-vacancies__subtitle-link'
                        >
                            vagas
                        </a>
                        .
                    </p>
                </div>

                <div className='company-vacancies__header-actions'>
                    <div className='company-vacancies__whatsapp-btn'>
                        <ButtonComponent
                            variant='primary'
                            onClick={() =>
                                toast.info('Funcionalidade em desenvolvimento.')
                            }
                        >
                            <span className='company-vacancies__button-content'>
                                <WhatsAppIcon fontSize='small' />
                                Chamar no Whatsapp
                            </span>
                        </ButtonComponent>
                    </div>

                    <ButtonComponent onClick={() => setShowCreateModal(true)}>
                        <span className='company-vacancies__button-content'>
                            <AddIcon fontSize='small' />
                            Nova Vaga
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            <div className='company-vacancies__filters-card'>
                <div className='company-vacancies__search-row'>
                    <div className='company-vacancies__search-input'>
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyFilters();
                            }}
                            placeholder='Buscar por nome'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent
                        onClick={handleApplyFilters}
                        disabled={isBusy}
                    >
                        <span className='company-vacancies__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleClearFilters}
                    >
                        <span className='company-vacancies__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <small className='company-vacancies__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

                <button
                    className='company-vacancies__advanced-toggle'
                    onClick={() => setShowAdvancedFilters((v) => !v)}
                    type='button'
                >
                    <span>
                        <FilterListRoundedIcon fontSize='small' />
                        Filtros Avançados
                    </span>
                    {showAdvancedFilters ? (
                        <KeyboardArrowUpRoundedIcon fontSize='small' />
                    ) : (
                        <KeyboardArrowDownRoundedIcon fontSize='small' />
                    )}
                </button>

                <Collapse in={showAdvancedFilters}>
                    <div className='company-vacancies__advanced-grid'>
                        <div>
                            <label className='company-vacancies__field-label'>
                                Exclusivo PCD
                            </label>
                            <Select
                                placeholder='Selecione'
                                options={pcdOptions}
                                onChange={(e) =>
                                    setDraftPcd(e ?? null)
                                }
                                isSearchable
                                isClearable
                            />
                        </div>

                        <div>
                            <label className='company-vacancies__field-label'>
                                Modalidade
                            </label>
                            <Select
                                placeholder='Selecione as modalidades'
                                options={workplaceTypeOptions}
                                onChange={(e) =>
                                    setDraftWorkplaceType(e ?? null)
                                }
                                isSearchable
                                isClearable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedCount > 0 && (
                <div className='company-vacancies__bulk-bar'>
                    <strong className='company-vacancies__bulk-count'>
                        {selectedCountLabel}
                    </strong>

                    <span className='company-vacancies__bulk-divider' />

                    <button
                        type='button'
                        className='company-vacancies__bulk-export-btn'
                        onClick={() =>
                            toast.info(
                                'Funcionalidade de exportação em desenvolvimento.',
                            )
                        }
                    >
                        <FileDownloadOutlinedIcon fontSize='small' />
                        Exportar selecionados
                    </button>

                    <button
                        type='button'
                        className='company-vacancies__bulk-close'
                        onClick={() => setSelectedRows({})}
                        aria-label='Limpar seleção'
                    >
                        ×
                    </button>
                </div>
            )}

            <div className='company-vacancies__table-card'>
                {isError ? (
                    <div className='company-vacancies__empty-state'>
                        <h2>Não foi possível carregar as vagas.</h2>
                    </div>
                ) : isEmpty ? (
                    hasFilters ? (
                        <div className='company-vacancies__empty-state'>
                            <h2>
                                Nenhuma vaga encontrada com os filtros
                                aplicados.
                            </h2>
                            <p>Tente ajustar a busca ou limpar os filtros.</p>
                            <ButtonComponent
                                variant='secondary'
                                onClick={handleClearFilters}
                            >
                                Limpar filtros
                            </ButtonComponent>
                        </div>
                    ) : (
                        <div className='company-vacancies__empty-state'>
                            <h2>Nenhuma vaga cadastrada</h2>
                            <p>Nenhuma vaga foi encontrada na plataforma.</p>
                        </div>
                    )
                ) : (
                    <BasicTable />
                )}
            </div>

            {((!!selectedVacancy.vacancy && selectedVacancy.mode === 'edit') ||
                showCreateModal) && (
                    <JobOpeningModalWrapper
                        open={!!selectedVacancy.vacancy || showCreateModal}
                        jobOpeningId={selectedVacancy.vacancy?.id}
                        onClose={() => {
                            setSelectedVacancy({ vacancy: null, mode: 'view' });
                            setShowCreateModal(false);
                        }}
                    />
                )}

            {!!selectedVacancy.vacancy && selectedVacancy.mode === 'view' && (
                <ViewJobOpeningModalWrapper
                    open={!!selectedVacancy.vacancy}
                    jobOpeningId={selectedVacancy.vacancy?.id}
                    onClose={() => {
                        setSelectedVacancy({ vacancy: null, mode: 'view' });
                        setShowCreateModal(false);
                    }}
                />
            )}
        </section>
    );
}

function ViewJobOpeningModalWrapper({
    open,
    jobOpeningId,
    onClose,
}: {
    open: boolean;
    jobOpeningId?: string;
    onClose: () => void;
}) {
    const { data: jobOpening, isLoading } =
        useGetCompanyJobOpening(jobOpeningId);

    if (isLoading) return <LoadingModal isOpen={!!isLoading} />;
    if (!jobOpening && !!jobOpeningId)
        return <LoadingModal isOpen={!!isLoading} />;

    return (
        <VacancyModal
            open={open}
            mode={'view'}
            vacancy={jobOpening ?? null}
            onClose={onClose}
        />
    );
}

function JobOpeningModalWrapper({
    open,
    jobOpeningId,
    onClose,
}: {
    open: boolean;
    jobOpeningId?: string;
    onClose: () => void;
}) {
    const { data: jobOpening, isLoading } =
        useGetCompanyJobOpening(jobOpeningId);

    if (isLoading) return <LoadingModal isOpen={!!isLoading} />;
    if (!jobOpening && !!jobOpeningId)
        return <LoadingModal isOpen={!!isLoading} />;

    return (
        <VacancyModal
            open={open}
            mode={jobOpeningId ? 'edit' : 'create'}
            vacancy={jobOpening ?? null}
            onClose={onClose}
        />
    );
}
