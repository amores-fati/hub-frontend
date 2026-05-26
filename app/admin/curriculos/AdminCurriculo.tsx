'use client';

import { Input, MultSelect } from '@/components/base';
import {
    AdminCurriculumDto,
    AdminCurriculumModality,
    AdminCurriculumStatus,
    AdminCurriculaQueryParams,
} from '@/dtos/AdminCurriculumDto';
import { Option } from '@/components/base/Select/select';
import {
    Avatar,
    Chip,
    CircularProgress,
    Collapse,
    IconButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
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
import { useAuth } from '@/providers/Auth/AuthProvider';
import { UserRole } from '@/dtos/UserDto';
import { useRouter } from 'next/navigation';
import { useGetAdminCurriculum } from '@/services/api/admin/curriculum/queries';

// ─── Labels & options ────────────────────────────────────────────────────────

const modalityLabels: Record<AdminCurriculumModality, string> = {
    [AdminCurriculumModality.PRESENCIAL]: 'Presencial',
    [AdminCurriculumModality.ONLINE]: 'Online',
    [AdminCurriculumModality.HIBRIDO]: 'Híbrido',
};

const statusLabels: Record<AdminCurriculumStatus, string> = {
    [AdminCurriculumStatus.ATIVO]: 'Ativo',
    [AdminCurriculumStatus.INATIVO]: 'Inativo',
};

const areaLabels: Record<string, string> = {
    design: 'Design',
    desenvolvimento: 'Desenvolvimento',
    dados: 'Dados',
    infraestrutura: 'Infraestrutura',
    gestao: 'Gestão',
    // mapeamentos legados para compatibilidade com dados existentes
    frontend: 'Frontend',
    backend: 'Backend',
    generalista: 'Generalista',
    data: 'Dados',
    qa: 'QA',
    ux: 'UX',
};

const locationOptions: Option[] = [
    { value: 'Florianopolis', label: 'Florianópolis/SC' },
    { value: 'Porto Alegre', label: 'Porto Alegre/RS' },
    { value: 'Curitiba', label: 'Curitiba/PR' },
    { value: 'Sao Paulo', label: 'São Paulo/SP' },
    { value: 'Campinas', label: 'Campinas/SP' },
    { value: 'Santos', label: 'Santos/SP' },
    { value: 'Recife', label: 'Recife/PE' },
    { value: 'Belo Horizonte', label: 'Belo Horizonte/MG' },
    { value: 'Rio de Janeiro', label: 'Rio de Janeiro/RJ' },
    { value: 'Niteroi', label: 'Niterói/RJ' },
    { value: 'Canoas', label: 'Canoas/RS' },
    { value: 'Salvador', label: 'Salvador/BA' },
];

const areaOptions: Option[] = [
    { value: 'design', label: 'Design' },
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'dados', label: 'Dados' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'gestao', label: 'Gestão' },
];

const modalityOptions: Option[] = [
    { value: AdminCurriculumModality.PRESENCIAL, label: modalityLabels[AdminCurriculumModality.PRESENCIAL] },
    { value: AdminCurriculumModality.ONLINE, label: modalityLabels[AdminCurriculumModality.ONLINE] },
    { value: AdminCurriculumModality.HIBRIDO, label: modalityLabels[AdminCurriculumModality.HIBRIDO] },
];

const statusOptions: Option[] = [
    { value: AdminCurriculumStatus.ATIVO, label: statusLabels[AdminCurriculumStatus.ATIVO] },
    { value: AdminCurriculumStatus.INATIVO, label: statusLabels[AdminCurriculumStatus.INATIVO] },
];

// ─── Badge helpers ────────────────────────────────────────────────────────────

const getAreaBadgeClass = (area: string) =>
    `admin-curriculos__badge admin-curriculos__badge--area admin-curriculos__badge--area-${(area ?? '').toLowerCase()}`;

const getModalityBadgeClass = (modality: AdminCurriculumModality) => {
    if (modality === AdminCurriculumModality.PRESENCIAL)
        return 'admin-curriculos__badge admin-curriculos__badge--presencial';
    if (modality === AdminCurriculumModality.ONLINE)
        return 'admin-curriculos__badge admin-curriculos__badge--online';
    return 'admin-curriculos__badge admin-curriculos__badge--hibrido';
};

const getStatusBadgeClass = (status: AdminCurriculumStatus) =>
    status === AdminCurriculumStatus.ATIVO
        ? 'admin-curriculos__badge admin-curriculos__badge--ativo'
        : 'admin-curriculos__badge admin-curriculos__badge--inativo';

// ─── PDF export helpers ───────────────────────────────────────────────────────

const exportCurriculaToPdf = (
    printWindow: Window | null,
    curricula: AdminCurriculumDto[],
    title: string,
) => {
    if (!printWindow) {
        toast.error('Não foi possível abrir a janela de exportação. Verifique o bloqueador de pop-up.');
        return;
    }
    const generatedAt = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date());
    const rows = curricula
        .map(
            (c) => `<tr>
                <td>${c.fullName}</td>
                <td>${c.cpf}</td>
                <td>${areaLabels[c.activityArea] ?? c.activityArea ?? 'Não informado'}</td>
                <td>${modalityLabels[c.modality] ?? c.modality}</td>
                <td>${statusLabels[c.status] ?? c.status}</td>
            </tr>`,
        )
        .join('');
    printWindow.document.write(`
        <html lang="pt-BR">
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 32px; color: #1d1d1d; }
                    h1 { margin-bottom: 8px; }
                    p { margin: 0 0 8px 0; color: #4f4f4f; }
                    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                    th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; font-size: 12px; }
                    th { background: #f8f9fa; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Data de geração: ${generatedAt}</p>
                <p>Total: ${curricula.length}</p>
                <table>
                    <thead><tr><th>Nome</th><th>CPF</th><th>Área</th><th>Preferência</th><th>Status</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};

const handleExportSelected = (selected: AdminCurriculumDto[]) => {
    if (selected.length === 0) {
        toast.info('Selecione pelo menos um currículo para exportar.');
        return;
    }
    const printWindow = window.open('', '_blank', 'width=1120,height=840');
    try {
        exportCurriculaToPdf(printWindow, selected, 'Gestão de Currículos');
    } catch {
        printWindow?.close();
        toast.error('Não foi possível exportar os currículos selecionados.');
    }
};

// ─── Filter state ─────────────────────────────────────────────────────────────

type AppliedFiltersState = {
    search: string;
    cities: string[];
    activityArea: string[];
    modality: string[];
    status: string[];
};

const initialFiltersState: AppliedFiltersState = {
    search: '',
    cities: [],
    activityArea: [],
    modality: [],
    status: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCurriculoPage() {
    return (
        <TableStoreProvider>
            <AdminCurriculo />
        </TableStoreProvider>
    );
}

function AdminCurriculo() {
    const { user, isHydrated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isHydrated) return;
        if (!user || user.role !== UserRole.ADMIN) router.push('/login');
    }, [user, isHydrated]);

    const page = useTableStore((s) => s.paginator.page);
    const rowsPerPage = useTableStore((s) => s.paginator.rowsPerPage);
    const setPaginator = useTableStore((s) => s.setPaginator);
    const setIsLoading = useTableStore((s) => s.setIsLoading);
    const setCells = useTableStore(
        (s: State<AdminCurriculumDto> & Action<AdminCurriculumDto>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<AdminCurriculumDto> & Action<AdminCurriculumDto>) => s.setContent,
    );
    const selectedCurricula = useTableStore((s) => s.selectedRows);
    const setSelectedCurricula = useTableStore((s) => s.setSelectedRows);

    const [searchInput, setSearchInput] = useState('');
    const [draftLocations, setDraftLocations] = useState<Option[]>([]);
    const [draftAreas, setDraftAreas] = useState<Option[]>([]);
    const [draftModalities, setDraftModalities] = useState<Option[]>([]);
    const [draftStatuses, setDraftStatuses] = useState<Option[]>([]);
    const [filters, setFilters] = useState<AppliedFiltersState>(initialFiltersState);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const hasFilters = useMemo(
        () =>
            Boolean(
                filters.search ||
                    filters.cities.length ||
                    filters.activityArea.length ||
                    filters.modality.length ||
                    filters.status.length,
            ),
        [filters],
    );

    const queryParams: AdminCurriculaQueryParams = {
        page,
        limit: rowsPerPage,
        search: filters.search || undefined,
        cities: filters.cities.length ? filters.cities : undefined,
        activityArea: filters.activityArea.length ? filters.activityArea : undefined,
        modality: filters.modality.length ? filters.modality : undefined,
        status: filters.status.length ? filters.status : undefined,
    };

    const { data, isLoading, isFetching, isError } = useGetAdminCurriculum(queryParams);

    useEffect(() => {
        if (data?.items) {
            setContent(data.items);
            setPaginator({ itemsCount: data.meta.total });
        }
        setIsLoading(isLoading || isFetching);
    }, [data, isLoading, isFetching]);

    useEffect(() => {
        setSelectedCurricula({});
    }, [filters, page]);

    const selectedCount = Object.keys(selectedCurricula).length;
    const selectedCountLabel = `${selectedCount} currículo${selectedCount === 1 ? '' : 's'} selecionado${selectedCount === 1 ? '' : 's'}`;

    const handleApplyAllFilters = () => {
        setPaginator({ page: 1 });
        setFilters({
            search: searchInput.trim(),
            cities: draftLocations.map((o) => String(o.value)),
            activityArea: draftAreas.map((o) => String(o.value)),
            modality: draftModalities.map((o) => String(o.value)),
            status: draftStatuses.map((o) => String(o.value)),
        });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setDraftLocations([]);
        setDraftAreas([]);
        setDraftModalities([]);
        setDraftStatuses([]);
        setPaginator({ page: 1 });
        setFilters(initialFiltersState);
    };

    const handleExportAll = () => {
        const items = data?.items ?? [];
        if (items.length === 0) {
            toast.info('Nenhum currículo encontrado para exportar.');
            return;
        }
        const printWindow = window.open('', '_blank', 'width=1120,height=840');
        setIsExporting(true);
        try {
            exportCurriculaToPdf(printWindow, items, 'Gestão de Currículos');
        } catch {
            printWindow?.close();
            toast.error('Não foi possível exportar a lista de currículos.');
        } finally {
            setIsExporting(false);
        }
    };

    const cells: Cells<AdminCurriculumDto>[] = [
        { key: 'id', header: '', type: CellType.CHECKBOX, sortable: false },
        {
            key: 'fullName',
            header: 'Aluno',
            type: CellType.TEXT,
            sortable: true,
            render: (c) => (
                <div className='admin-curriculos__student-cell'>
                    <Avatar
                        src={c.photoUrl || undefined}
                        className='admin-curriculos__avatar'
                    >
                        {c.fullName
                            .split(' ')
                            .slice(0, 2)
                            .map((n) => n[0]?.toUpperCase())
                            .join('')}
                    </Avatar>
                    <div>
                        <span className='admin-curriculos__student-name'>{c.fullName}</span>
                        <span className='admin-curriculos__student-cpf'>{c.cpf}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'activityArea',
            header: 'Área de Interesse',
            sortable: true,
            render: (c) => (
                <Chip
                    label={areaLabels[c.activityArea] ?? c.activityArea ?? 'Não informado'}
                    className={getAreaBadgeClass(c.activityArea)}
                />
            ),
        },
        {
            key: 'modality',
            header: 'Preferência',
            sortable: true,
            render: (c) => (
                <Chip
                    label={modalityLabels[c.modality] ?? c.modality}
                    className={getModalityBadgeClass(c.modality)}
                />
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (c) => (
                <Chip
                    label={statusLabels[c.status] ?? c.status}
                    className={getStatusBadgeClass(c.status)}
                />
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            sortable: false,
            render: (c) => (
                <div className='admin-curriculos__actions'>
                 <IconButton
    className='custom-table__action-button'
    component='a'
    href={`/admin/curriculo?studentId=${c.studentId}`}
    title='Ver currículo'
>
    <AssignmentIndIcon fontSize='small' />
</IconButton>


                    <IconButton
                        className='admin-curriculos__action-btn'
                        component='a'
                        href={c.githubUrl ?? '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        disabled={!c.githubUrl}
                        title='GitHub'
                    >
                        <GitHubIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        className='admin-curriculos__action-btn'
                        component='a'
                        href={c.linkedinUrl ?? '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        disabled={!c.linkedinUrl}
                        title='LinkedIn'
                    >
                        <LinkedInIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        className='admin-curriculos__action-btn'
                        component='a'
                        href={
                            c.phoneNumber
                                ? `https://wa.me/55${c.phoneNumber.replace(/\D/g, '')}`
                                : '#'
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        disabled={!c.phoneNumber}
                        title='WhatsApp'
                    >
                        <WhatsAppIcon fontSize='small' />
                    </IconButton>
                </div>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    if (!isHydrated || !user || user.role !== UserRole.ADMIN) return null;

    const isBusy = isLoading || isFetching;
    const items = data?.items ?? [];
    const isEmpty = !isBusy && items.length === 0;

    return (
        <section className='admin-curriculos'>
            {/* Cabeçalho */}
            <div className='admin-curriculos__header'>
                <div>
                    <span className='admin-curriculos__eyebrow'>Área administrativa</span>
                    <h1 className='admin-curriculos__title'>Gestão de Currículos</h1>
                
                </div>
                <div className='admin-curriculos__header-action'>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => void handleExportAll()}
                        disabled={isExporting || isBusy}
                    >
                        <span className='admin-curriculos__button-content'>
                            {isExporting ? (
                                <CircularProgress size={16} />
                            ) : (
                                <FileDownloadOutlinedIcon fontSize='small' />
                            )}
                            Exportar Lista
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            {/* Busca e filtros */}
            <div className='admin-curriculos__filters-card'>
                <div className='admin-curriculos__search-row'>
                    <div className='admin-curriculos__search-wrapper'>
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyAllFilters();
                            }}
                            placeholder='Buscar por nome, CPF, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>
                    <ButtonComponent onClick={handleApplyAllFilters}>
                        <span className='admin-curriculos__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>
                    <ButtonComponent variant='secondary' onClick={handleClearFilters}>
                        <span className='admin-curriculos__button-content'>
                            <RestartAltRoundedIcon fontSize='small' />
                            Limpar
                        </span>
                    </ButtonComponent>
                </div>

                <small className='admin-curriculos__search-helper'>
                    A busca funciona com qualquer quantidade de caracteres.
                </small>

                <button
                    className='admin-curriculos__advanced-toggle'
                    onClick={() => setShowAdvancedFilters((v) => !v)}
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
                    <div className='admin-curriculos__advanced-grid'>
                        <div className='admin-curriculos__filter-group'>
                            <label className='admin-curriculos__filter-label'>Localização</label>
                            <MultSelect
                                placeholder='Selecione as cidades'
                                options={locationOptions}
                                value={draftLocations}
                                onChange={(opts) => setDraftLocations([...(opts ?? [])])}
                                isSearchable
                            />
                        </div>
                        <div className='admin-curriculos__filter-group'>
                            <label className='admin-curriculos__filter-label'>Área de Interesse</label>
                            <MultSelect
                                placeholder='Selecione as áreas'
                                options={areaOptions}
                                value={draftAreas}
                                onChange={(opts) => setDraftAreas([...(opts ?? [])])}
                                isSearchable
                            />
                        </div>
                        <div className='admin-curriculos__filter-group'>
                            <label className='admin-curriculos__filter-label'>Preferência</label>
                            <MultSelect
                                placeholder='Selecione as modalidades'
                                options={modalityOptions}
                                value={draftModalities}
                                onChange={(opts) => setDraftModalities([...(opts ?? [])])}
                                isSearchable
                            />
                        </div>
                        <div className='admin-curriculos__filter-group'>
                            <label className='admin-curriculos__filter-label'>Status</label>
                            <MultSelect
                                placeholder='Selecione os status'
                                options={statusOptions}
                                value={draftStatuses}
                                onChange={(opts) => setDraftStatuses([...(opts ?? [])])}
                                isSearchable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {/* Barra de seleção em lote */}
            {selectedCount > 0 && (
                <div className='admin-curriculos__bulk-bar'>
                    <strong className='admin-curriculos__bulk-count'>{selectedCountLabel}</strong>
                    <span className='admin-curriculos__bulk-divider' />
                    <button
                        type='button'
                        className='admin-curriculos__bulk-export-btn'
                        onClick={() =>
                            handleExportSelected(
                                Object.values(selectedCurricula) as AdminCurriculumDto[],
                            )
                        }
                    >
                        <FileDownloadOutlinedIcon fontSize='small' />
                        Exportar selecionados
                    </button>
                    <button
                        type='button'
                        className='admin-curriculos__bulk-close'
                        aria-label='Limpar seleção'
                        onClick={() => setSelectedCurricula({})}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Tabela */}
            <div className='admin-curriculos__table-card admin-curriculos__table-wrapper'>
                {isError ? (
                    <div className='admin-curriculos__empty'>
                        <h2>Erro ao carregar currículos</h2>
                        <p>Não foi possível buscar os dados. Tente novamente.</p>
                    </div>
                ) : isBusy && items.length === 0 ? (
                    <div className='admin-curriculos__loading'>
                        <CircularProgress size={32} />
                    </div>
                ) : isEmpty ? (
                    hasFilters ? (
                        <div className='admin-curriculos__empty'>
                            <h2>Nenhum currículo encontrado com os filtros aplicados.</h2>
                            <p>Tente ajustar a busca ou limpar os filtros.</p>
                            <ButtonComponent variant='secondary' onClick={handleClearFilters}>
                                Limpar filtros
                            </ButtonComponent>
                        </div>
                    ) : (
                        <div className='admin-curriculos__empty'>
                            <h2>Nenhum currículo cadastrado</h2>
                            <p>Nenhum currículo foi encontrado na plataforma.</p>
                        </div>
                    )
                ) : (
                    <BasicTable />
                )}
            </div>
        </section>
    );
}
