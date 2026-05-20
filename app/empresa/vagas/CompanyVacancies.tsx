'use client';

import { Input, Loading, MultSelect, Table } from '@/components/base';
import { VacanciesQueryParams, VacancyDto, WorkplaceType } from '@/dtos/VacancyDto';
import { Option } from '@/components/base/Select/select';
import {
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '@/components/base/Button/button';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetCompanyVacancies } from '@/services/api/companies/vacancies/queries';
import { useDeleteVacancy } from '@/services/api/companies/vacancies/mutations';
import { VacancyModal, VacancyModalMode } from './VacancyModal';
import './index.scss';

const PAGE_SIZE = 5;

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
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

type FiltersState = {
    search: string;
    isPcd: string[];
    workplaceTypes: string[];
};

const initialFilters: FiltersState = {
    search: '',
    isPcd: [],
    workplaceTypes: [],
};

export function CompanyVacancies() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [draftPcd, setDraftPcd] = useState<Option[]>([]);
    const [draftWorkplaceTypes, setDraftWorkplaceTypes] = useState<Option[]>([]);
    const [filters, setFilters] = useState<FiltersState>(initialFilters);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [vacancyPendingDelete, setVacancyPendingDelete] =
        useState<VacancyDto | null>(null);
    const [modalState, setModalState] = useState<{
        open: boolean;
        mode: VacancyModalMode;
        vacancy?: VacancyDto;
    }>({ open: false, mode: 'create' });

    const openModal = (mode: VacancyModalMode, vacancy?: VacancyDto) =>
        setModalState({ open: true, mode, vacancy });
    const closeModal = () =>
        setModalState((prev) => ({ ...prev, open: false }));

    const queryParams = useMemo<VacanciesQueryParams>(
        () => ({
            page,
            limit: PAGE_SIZE,
            search: filters.search || undefined,
            isPcd:
                filters.isPcd.length === 1
                    ? filters.isPcd[0] === 'true'
                    : undefined,
            workplaceTypes:
                filters.workplaceTypes.length > 0
                    ? filters.workplaceTypes
                    : undefined,
        }),
        [filters, page],
    );

    const { data, isLoading, isFetching, isError } =
        useGetCompanyVacancies(queryParams);
    const deleteVacancyMutation = useDeleteVacancy();

    const vacancies = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const visibleIds = vacancies.map((v) => v.id);
    const selectedVisibleCount = visibleIds.filter((id) =>
        selectedIds.includes(id),
    ).length;
    const allVisibleSelected =
        visibleIds.length > 0 &&
        selectedVisibleCount === visibleIds.length;
    const someVisibleSelected =
        selectedVisibleCount > 0 &&
        selectedVisibleCount < visibleIds.length;
    const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(page * PAGE_SIZE, total);
    const selectedCountLabel = `${selectedIds.length} vaga${selectedIds.length === 1 ? '' : 's'} selecionada${selectedIds.length === 1 ? '' : 's'}`;

    const handleApplyFilters = () => {
        setPage(1);
        setFilters({
            search: searchInput.trim(),
            isPcd: draftPcd.map((o) => String(o.value)),
            workplaceTypes: draftWorkplaceTypes.map((o) => String(o.value)),
        });
    };

    const handleClearFilters = () => {
        setPage(1);
        setSearchInput('');
        setDraftPcd([]);
        setDraftWorkplaceTypes([]);
        setFilters(initialFilters);
        setSelectedIds([]);
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleAllVisible = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !visibleIds.includes(id)),
            );
            return;
        }
        setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
    };

    const handleDelete = async () => {
        if (!vacancyPendingDelete) return;
        await deleteVacancyMutation.mutateAsync(vacancyPendingDelete.id);
        setSelectedIds((prev) =>
            prev.filter((id) => id !== vacancyPendingDelete.id),
        );
        setVacancyPendingDelete(null);
    };

    const columns = useMemo(
        () => [
            {
                key: 'title',
                header: 'Nome',
                render: (vacancy: VacancyDto) => (
                    <span className='company-vacancies__vacancy-name'>
                        {vacancy.title}
                    </span>
                ),
            },
            {
                key: 'vacancyCount',
                header: 'Número de Vagas',
                render: (vacancy: VacancyDto) => vacancy.vacancyCount,
            },
            {
                key: 'isPcd',
                header: 'Exclusivo PCD',
                render: (vacancy: VacancyDto) => (
                    <Chip
                        label={vacancy.isPcd ? 'SIM' : 'NÃO'}
                        className={`company-vacancies__badge company-vacancies__badge--${vacancy.isPcd ? 'success' : 'danger'}`}
                    />
                ),
            },
            {
                key: 'workplaceType',
                header: 'Modalidade',
                render: (vacancy: VacancyDto) =>
                    vacancy.workplaceType ? (
                        <Chip
                            label={workplaceTypeLabels[vacancy.workplaceType]}
                            className={`company-vacancies__badge company-vacancies__badge--workplace-${vacancy.workplaceType}`}
                        />
                    ) : (
                        <span className='company-vacancies__empty-cell'>—</span>
                    ),
            },
            {
                key: 'announcementDate',
                header: 'Data de Anúncio',
                render: (vacancy: VacancyDto) => (
                    <Chip
                        label={formatAnnouncementDate(vacancy.announcementDate)}
                        className='company-vacancies__badge company-vacancies__badge--date'
                    />
                ),
            },
        ],
        [],
    );

    return (
        <section className='company-vacancies'>
            <div className='company-vacancies__header'>
                <div>
                    <h1>Gestão de Vagas</h1>
                    <p>
                        Administração centralizada de{' '}
                        <a href='#' className='company-vacancies__subtitle-link'>
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

                    <ButtonComponent onClick={() => openModal('create')}>
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
                            placeholder='Buscar por nome, número de vagas, exclusividade para PCD...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent
                        onClick={handleApplyFilters}
                        disabled={isLoading}
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
                            <MultSelect
                                placeholder='Selecione'
                                options={pcdOptions}
                                value={draftPcd}
                                onChange={(opts) =>
                                    setDraftPcd([...(opts ?? [])])
                                }
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className='company-vacancies__field-label'>
                                Modalidade
                            </label>
                            <MultSelect
                                placeholder='Selecione as modalidades'
                                options={workplaceTypeOptions}
                                value={draftWorkplaceTypes}
                                onChange={(opts) =>
                                    setDraftWorkplaceTypes([...(opts ?? [])])
                                }
                                isSearchable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedIds.length > 0 && (
                <div className='company-vacancies__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='company-vacancies__bulk-actions'>
                        <button
                            type='button'
                            onClick={() =>
                                toast.info('Funcionalidade em desenvolvimento.')
                            }
                        >
                            <MessageOutlinedIcon fontSize='small' />
                            Enviar mensagem
                        </button>

                        <button
                            type='button'
                            onClick={() =>
                                toast.info('Funcionalidade em desenvolvimento.')
                            }
                        >
                            <SystemUpdateAltOutlinedIcon fontSize='small' />
                            Atualizar status
                        </button>

                        <button
                            type='button'
                            onClick={() =>
                                toast.info('Funcionalidade em desenvolvimento.')
                            }
                        >
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar selecionados
                        </button>

                        <button
                            type='button'
                            className='company-vacancies__bulk-clear'
                            onClick={() => setSelectedIds([])}
                            aria-label='Limpar seleção'
                        >
                            <CloseIcon fontSize='small' />
                        </button>
                    </div>
                </div>
            )}

            <div className='company-vacancies__table-card'>
                {isLoading && !data ? (
                    <div className='company-vacancies__loading-state'>
                        <Loading />
                    </div>
                ) : isError ? (
                    <div className='company-vacancies__empty-state'>
                        <span className='company-vacancies__eyebrow'>
                            Erro ao carregar
                        </span>
                        <h2>Não foi possível carregar as vagas.</h2>
                    </div>
                ) : vacancies.length === 0 ? (
                    <div className='company-vacancies__empty-state'>
                        <h2>
                            Nenhuma vaga encontrada com os filtros aplicados.
                        </h2>
                        <p>Tente ajustar a busca ou limpar os filtros.</p>
                    </div>
                ) : (
                    <Table
                        values={vacancies}
                        columns={columns}
                        getRowId={(v) => v.id}
                        selectable
                        selectedIds={selectedIds}
                        allVisibleSelected={allVisibleSelected}
                        someVisibleSelected={someVisibleSelected}
                        onToggleSelect={toggleSelection}
                        onToggleSelectAll={toggleAllVisible}
                        actionColumnConfig={{
                            showView: true,
                            onView: (vacancy) => openModal('view', vacancy),
                            showEdit: true,
                            onEdit: (vacancy) => openModal('edit', vacancy),
                            showDelete: true,
                            onDelete: (vacancy) =>
                                setVacancyPendingDelete(vacancy),
                        }}
                        pagination={{
                            page,
                            count: totalPages,
                            onChange: setPage,
                            isFetching,
                            summaryText: `Exibindo ${rangeStart} a ${rangeEnd} de ${total} vagas`,
                        }}
                    />
                )}
            </div>

            <VacancyModal
                open={modalState.open}
                mode={modalState.mode}
                vacancy={modalState.vacancy}
                onClose={closeModal}
            />

            <Dialog
                open={!!vacancyPendingDelete}
                onClose={() => setVacancyPendingDelete(null)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Excluir vaga</DialogTitle>
                <DialogContent dividers>
                    <p>
                        Deseja realmente excluir a vaga{' '}
                        <strong>{vacancyPendingDelete?.title}</strong>?
                    </p>
                </DialogContent>
                <DialogActions>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setVacancyPendingDelete(null)}
                    >
                        Cancelar
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={() => {
                            void handleDelete();
                        }}
                        disabled={deleteVacancyMutation.isPending}
                    >
                        <span className='company-vacancies__button-content'>
                            {deleteVacancyMutation.isPending ? (
                                <CircularProgress size={16} />
                            ) : null}
                            Confirmar exclusão
                        </span>
                    </ButtonComponent>
                </DialogActions>
            </Dialog>
        </section>
    );
}
