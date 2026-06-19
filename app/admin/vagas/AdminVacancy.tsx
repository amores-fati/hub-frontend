'use client';

import { Chip, Collapse, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useEffect, useMemo, useState } from 'react';
import { InputComponent } from '@/components/base/Input/input';
import { ButtonComponent } from '@/components/base/Button/button';
import { Select } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import {
    Action,
    State,
    TableStoreProvider,
    useTableStore,
} from '@/stores/TableStoreProvider';
import { Cells, CellType } from '@/components/base/Table2/types';
import BasicTable from '@/components/base/Table2/table';
import { VacancyDto, WorkplaceType } from '@/dtos/VacancyDto';
import './index.scss';

const EMPRESAS = [
    'HP',
    'DELL',
    'TECHLIFE',
    'TechCorp',
    'DataBrasil',
    'Inova Sistemas',
    'CloudBR',
    'SecureNet',
];
const TITULOS = [
    'Estagiário Frontend - Python',
    'Desenvolvedor Backend - Java',
    'Estágiario UX',
    'Desenvolvimento FullStack',
    'Estagiário QA',
    'Analista de Dados',
    'Desenvolvedor Frontend - React',
    'Engenheiro DevOps',
    'Analista de Suporte',
    'Engenheiro de Machine Learning',
];
const WORKPLACE_TYPES = [
    WorkplaceType.PRESENTIAL,
    WorkplaceType.ONLINE,
    WorkplaceType.HYBRID,
];

type MockVacancy = VacancyDto & { empresa: string };

const generateMockVagas = (count: number): MockVacancy[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = TITULOS[i % TITULOS.length];
        const empresa = EMPRESAS[i % EMPRESAS.length];
        const workplaceType = WORKPLACE_TYPES[i % WORKPLACE_TYPES.length];
        const isPcd = i % 3 === 0;
        const day = String((i % 28) + 1).padStart(2, '0');
        const month = String((i % 12) + 1).padStart(2, '0');
        const year = i % 2 === 0 ? '2026' : '2025';

        return {
            id: String(i + 1),
            name,
            empresa,
            openingsCount: (i % 12) + 1,
            vacancyCount: (i % 12) + 1,
            workplaceType,
            isPcd,
            announcementDate: `${year}-${month}-${day}`,
            description: `Vaga de ${name} na empresa ${empresa}, modalidade ${workplaceType}.`,
            applicationLink: `https://${empresa.toLowerCase().replace(/\s+/g, '')}.com/vagas/${i + 1}`,
            skills: [],
            companyId: empresa,
        };
    });
};

const MOCK_VAGAS: MockVacancy[] = generateMockVagas(245);

const PAGE_SIZE = 5;

const normalize = (s: string) =>
    s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();

const workplaceTypeLabels: Record<WorkplaceType, string> = {
    [WorkplaceType.PRESENTIAL]: 'Presencial',
    [WorkplaceType.ONLINE]: 'Online',
    [WorkplaceType.HYBRID]: 'Híbrido',
};

const workplaceTypeOptions: Option[] = [
    { value: WorkplaceType.PRESENTIAL, label: workplaceTypeLabels[WorkplaceType.PRESENTIAL] },
    { value: WorkplaceType.ONLINE, label: workplaceTypeLabels[WorkplaceType.ONLINE] },
    { value: WorkplaceType.HYBRID, label: workplaceTypeLabels[WorkplaceType.HYBRID] },
];

const pcdOptions: Option[] = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
];

const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

const getWorkplaceBadgeClassName = (workplaceType?: WorkplaceType | null) => {
    switch (workplaceType) {
        case WorkplaceType.PRESENTIAL:
            return 'admin-vagas__badge admin-vagas__badge--presencial';
        case WorkplaceType.ONLINE:
            return 'admin-vagas__badge admin-vagas__badge--online';
        case WorkplaceType.HYBRID:
            return 'admin-vagas__badge admin-vagas__badge--hibrido';
        default:
            return 'admin-vagas__badge admin-vagas__badge--neutral';
    }
};

type CustomPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    summaryText: string;
};

function CustomPagination({
    page,
    totalPages,
    onPageChange,
    summaryText,
}: CustomPaginationProps) {
    const visiblePages = useMemo(() => {
        const maxVisible = 3;
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        let start = Math.max(1, page - 1);
        const end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages]);

    return (
        <div className='admin-vagas__pagination'>
            <span className='admin-vagas__pagination-info'>{summaryText}</span>

            <div className='admin-vagas__pagination-controls'>
                <button
                    type='button'
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className='admin-vagas__pagination-btn admin-vagas__pagination-btn--text'
                >
                    Anterior
                </button>

                {visiblePages.map((p) => (
                    <button
                        key={p}
                        type='button'
                        onClick={() => onPageChange(p)}
                        className={`admin-vagas__pagination-btn ${p === page ? 'admin-vagas__pagination-btn--active' : ''}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    type='button'
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className='admin-vagas__pagination-btn admin-vagas__pagination-btn--text'
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}

export default function Index() {
    return (
        <TableStoreProvider>
            <AdminVagas />
        </TableStoreProvider>
    );
}

function AdminVagas() {
    const setIsLoading = useTableStore((state) => state.setIsLoading);
    const setPaginator = useTableStore((state) => state.setPaginator);
    const setCells = useTableStore(
        (s: State<MockVacancy> & Action<MockVacancy>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<MockVacancy> & Action<MockVacancy>) => s.setContent,
    );
    const selectedRows = useTableStore((state) => state.selectedRows);
    const setSelectedRows = useTableStore((state) => state.setSelectedRows);

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [draftPcd, setDraftPcd] = useState<Option | null>(null);
    const [draftWorkplaceType, setDraftWorkplaceType] = useState<Option | null>(null);
    const [appliedPcd, setAppliedPcd] = useState<string | null>(null);
    const [appliedWorkplaceType, setAppliedWorkplaceType] = useState<string | null>(null);

    const handleSearch = () => {
        setAppliedSearch(searchInput.trim());
        setAppliedPcd(draftPcd ? String(draftPcd.value) : null);
        setAppliedWorkplaceType(draftWorkplaceType ? String(draftWorkplaceType.value) : null);
        setPage(1);
    };

    const handleClear = () => {
        setSearchInput('');
        setAppliedSearch('');
        setDraftPcd(null);
        setDraftWorkplaceType(null);
        setAppliedPcd(null);
        setAppliedWorkplaceType(null);
        setShowAdvancedFilters(false);
        setPage(1);
    };

    const filteredVagas = useMemo(() => {
        return MOCK_VAGAS.filter((v) => {
            if (appliedSearch) {
                const term = normalize(appliedSearch);
                const matchesSearch =
                    normalize(v.name).includes(term) ||
                    normalize(v.empresa).includes(term) ||
                    String(v.openingsCount).includes(term) ||
                    (v.isPcd && ['pcd', 'sim'].includes(term)) ||
                    (!v.isPcd && ['nao', 'não'].includes(term));
                if (!matchesSearch) return false;
            }
            if (appliedPcd !== null) {
                if (appliedPcd === 'true' && !v.isPcd) return false;
                if (appliedPcd === 'false' && v.isPcd) return false;
            }
            if (appliedWorkplaceType !== null && v.workplaceType !== (appliedWorkplaceType as WorkplaceType)) {
                return false;
            }
            return true;
        });
    }, [appliedSearch, appliedPcd, appliedWorkplaceType]);

    const totalPages = Math.max(1, Math.ceil(filteredVagas.length / PAGE_SIZE));
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginated = filteredVagas.slice(startIndex, startIndex + PAGE_SIZE);

    useEffect(() => {
        setContent(paginated);
        setPaginator({
            itemsCount: filteredVagas.length,
            page,
        });
        setIsLoading(false);
    }, [page, appliedSearch, appliedPcd, appliedWorkplaceType]);

    useEffect(() => {
        setSelectedRows({});
    }, [page, appliedSearch, appliedPcd, appliedWorkplaceType]);

    const selectedCount = Object.keys(selectedRows).length;
    const selectedCountLabel = `${selectedCount} vaga${selectedCount === 1 ? '' : 's'} selecionada${selectedCount === 1 ? '' : 's'}`;

    const handleClearSelection = () => setSelectedRows({});

    const cells: Cells<MockVacancy>[] = [
        {
            key: 'id',
            header: '',
            type: CellType.CHECKBOX,
            sortable: false,
        },
        {
            key: 'name',
            header: 'Título',
            sortable: false,
            render: (row) => (
                <span className='admin-vagas__title-cell'>{row.name}</span>
            ),
        },
        {
            key: 'empresa',
            header: 'Empresa',
            sortable: false,
            render: (row) => row.empresa,
        },
        {
            key: 'openingsCount',
            header: 'Número de Vagas',
            sortable: false,
            render: (row) => row.openingsCount,
        },
        {
            key: 'workplaceType',
            header: 'Modalidade',
            sortable: false,
            render: (row) =>
                row.workplaceType ? (
                    <Chip
                        label={workplaceTypeLabels[row.workplaceType]}
                        className={getWorkplaceBadgeClassName(
                            row.workplaceType,
                        )}
                    />
                ) : (
                    <span>—</span>
                ),
        },
        {
            key: 'isPcd',
            header: 'Exclusivo PCD',
            sortable: false,
            render: (row) => (
                <Chip
                    label={row.isPcd ? 'SIM' : 'NÃO'}
                    className={
                        row.isPcd
                            ? 'admin-vagas__badge admin-vagas__badge--success'
                            : 'admin-vagas__badge admin-vagas__badge--danger'
                    }
                />
            ),
        },
        {
            key: 'announcementDate',
            header: 'Data de Anúncio',
            sortable: false,
            render: (row) => (
                <Chip
                    label={formatDate(row.announcementDate)}
                    className='admin-vagas__badge admin-vagas__badge--info'
                />
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            sortable: false,
            render: (row) => (
                <IconButton
                    className='custom-table__action-button'
                    onClick={() => {
                        // Modal real implementado na 18.1.4
                    }}
                >
                    <VisibilityOutlinedIcon fontSize='small' />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    return (
        <section className='admin-vagas'>
            <div className='admin-vagas__header'>
                <div>
                    <span className='admin-vagas__eyebrow'>
                        Área administrativa
                    </span>
                    <h1>Gestão de Vagas</h1>
                </div>
            </div>

            <div className='admin-vagas__filters-card'>
                <div className='admin-vagas__search-row'>
                    <div className='admin-vagas__search-input'>
                        <InputComponent
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            placeholder='Buscar por nome, número de vagas, exclusividade para PCD...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent onClick={handleSearch}>
                        Buscar
                    </ButtonComponent>

                    <ButtonComponent variant='secondary' onClick={handleClear}>
                        Limpar
                    </ButtonComponent>
                </div>

                <button
                    type='button'
                    className='admin-vagas__advanced-toggle'
                    onClick={() => setShowAdvancedFilters((v) => !v)}
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
                    <div className='admin-vagas__advanced-grid'>
                        <div>
                            <label className='admin-vagas__field-label'>
                                Exclusivo PCD
                            </label>
                            <Select
                                placeholder='Selecione'
                                options={pcdOptions}
                                onChange={(e) => setDraftPcd(e ?? null)}
                                value={draftPcd}
                                isSearchable
                                isClearable
                            />
                        </div>

                        <div>
                            <label className='admin-vagas__field-label'>
                                Modalidade
                            </label>
                            <Select
                                placeholder='Selecione as modalidades'
                                options={workplaceTypeOptions}
                                onChange={(e) => setDraftWorkplaceType(e ?? null)}
                                value={draftWorkplaceType}
                                isSearchable
                                isClearable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedCount > 0 && (
                <div className='admin-vagas__bulk-bar'>
                    <div className='admin-vagas__bulk-bar-left'>
                        <strong>{selectedCountLabel}</strong>
                        <span className='admin-vagas__bulk-divider' />
                        <button
                            type='button'
                            className='admin-vagas__bulk-export'
                        >
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar selecionados
                        </button>
                    </div>
                    <button
                        type='button'
                        onClick={handleClearSelection}
                        className='admin-vagas__bulk-close'
                        aria-label='Limpar seleção'
                    >
                        ×
                    </button>
                </div>
            )}

            <div className='admin-vagas__table-card admin-vagas__table-card--no-default-pagination'>
                {filteredVagas.length === 0 ? (
                    <div className='admin-vagas__empty-state'>
                        <h2>Nenhuma vaga encontrada</h2>
                    </div>
                ) : (
                    <>
                        <BasicTable />
                        <CustomPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            summaryText={`Exibindo ${startIndex + 1} a ${Math.min(
                                startIndex + PAGE_SIZE,
                                filteredVagas.length,
                            )} de ${filteredVagas.length} vagas`}
                        />
                    </>
                )}
            </div>
        </section>
    );
}
