'use client';

import { Chip } from '@mui/material';
import { useState } from 'react';
import { Table, TableColumn } from '@/components/base/Table/table';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './index.scss';

export enum ModalidadeVaga {
    PRESENCIAL = 'PRESENCIAL',
    ONLINE = 'ONLINE',
    HIBRIDO = 'HÍBRIDO',
}

export type VagaDto = {
    id: string;
    titulo: string;
    empresa: string;
    numeroVagas: number;
    modalidade: ModalidadeVaga;
    exclusivoPcd: boolean;
    dataAnuncio: string;
    descricao: string;
    linkVaga: string;
    tipoVaga: string;
    skills: string[];
};

const EMPRESAS = ['HP', 'DELL', 'TECHLIFE', 'TechCorp', 'DataBrasil', 'Inova Sistemas', 'CloudBR', 'SecureNet'];
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
const MODALIDADES = [ModalidadeVaga.PRESENCIAL, ModalidadeVaga.ONLINE, ModalidadeVaga.HIBRIDO];
const TIPOS_VAGA = ['CLT', 'PJ', 'Estágio'];
const SKILLS_POOL = ['React', 'TypeScript', 'Python', 'Java', 'SQL', 'Docker', 'AWS', 'Figma', 'Node.js', 'CSS'];

const generateMockVagas = (count: number): VagaDto[] => {
    return Array.from({ length: count }, (_, i) => {
        const titulo = TITULOS[i % TITULOS.length];
        const empresa = EMPRESAS[i % EMPRESAS.length];
        const modalidade = MODALIDADES[i % MODALIDADES.length];
        const exclusivoPcd = i % 3 === 0;
        const day = String((i % 28) + 1).padStart(2, '0');
        const month = String((i % 12) + 1).padStart(2, '0');
        const year = i % 2 === 0 ? '2026' : '2025';

        return {
            id: String(i + 1),
            titulo,
            empresa,
            numeroVagas: (i % 12) + 1,
            modalidade,
            exclusivoPcd,
            dataAnuncio: `${year}-${month}-${day}`,
            descricao: `Vaga de ${titulo} na empresa ${empresa}, modalidade ${modalidade.toLowerCase()}.`,
            linkVaga: `https://${empresa.toLowerCase().replace(/\s+/g, '')}.com/vagas/${i + 1}`,
            tipoVaga: TIPOS_VAGA[i % TIPOS_VAGA.length],
            skills: [
                SKILLS_POOL[i % SKILLS_POOL.length],
                SKILLS_POOL[(i + 1) % SKILLS_POOL.length],
                SKILLS_POOL[(i + 2) % SKILLS_POOL.length],
            ],
        };
    });
};

// Dados mockados desta subtask. Quando a 18.1.2 existir, a lista filtrada
// deve vir via prop em vez deste array fixo.
const MOCK_VAGAS: VagaDto[] = generateMockVagas(245);

const PAGE_SIZE = 5;

const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

const getModalidadeBadgeClassName = (modalidade: ModalidadeVaga) => {
    switch (modalidade) {
        case ModalidadeVaga.PRESENCIAL:
            return 'admin-vagas__badge admin-vagas__badge--presencial';
        case ModalidadeVaga.ONLINE:
            return 'admin-vagas__badge admin-vagas__badge--online';
        case ModalidadeVaga.HIBRIDO:
            return 'admin-vagas__badge admin-vagas__badge--hibrido';
        default:
            return 'admin-vagas__badge admin-vagas__badge--neutral';
    }
};

export default function AdminVagas() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(MOCK_VAGAS.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const paginated = MOCK_VAGAS.slice(startIndex, startIndex + PAGE_SIZE);

    const visibleIds = paginated.map((v) => v.id);
    const allVisibleSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    const someVisibleSelected =
        visibleIds.some((id) => selectedIds.includes(id)) && !allVisibleSelected;

    const handleToggleSelect = (rowId: string) => {
        setSelectedIds((prev) =>
            prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
        );
    };

    const handleToggleSelectAll = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
        } else {
            setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleClearSelection = () => setSelectedIds([]);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        setSelectedIds([]);
    };

    const selectedCount = selectedIds.length;
    const selectedCountLabel = `${selectedCount} vaga${selectedCount === 1 ? '' : 's'} selecionada${selectedCount === 1 ? '' : 's'}`;

    const columns: TableColumn<VagaDto>[] = [
        {
            key: 'titulo',
            header: 'Título',
            render: (row) => <span className='admin-vagas__title-cell'>{row.titulo}</span>,
        },
        {
            key: 'empresa',
            header: 'Empresa',
            render: (row) => row.empresa,
        },
        {
            key: 'numeroVagas',
            header: 'Número de Vagas',
            render: (row) => row.numeroVagas,
        },
        {
            key: 'modalidade',
            header: 'Modalidade',
            render: (row) => (
                <Chip label={row.modalidade} className={getModalidadeBadgeClassName(row.modalidade)} />
            ),
        },
        {
            key: 'exclusivoPcd',
            header: 'Exclusivo PCD',
            render: (row) => (
                <Chip
                    label={row.exclusivoPcd ? 'SIM' : 'NÃO'}
                    className={
                        row.exclusivoPcd
                            ? 'admin-vagas__badge admin-vagas__badge--success'
                            : 'admin-vagas__badge admin-vagas__badge--danger'
                    }
                />
            ),
        },
        {
            key: 'dataAnuncio',
            header: 'Data de Anúncio',
            render: (row) => (
                <Chip label={formatDate(row.dataAnuncio)} className='admin-vagas__badge admin-vagas__badge--info' />
            ),
        },
    ];

    return (
        <section className='admin-vagas'>
            <div className='admin-vagas__header'>
                <div>
                    <span className='admin-vagas__eyebrow'>Área administrativa</span>
                    <h1>Gestão de Vagas</h1>
                </div>
            </div>

            {selectedCount > 0 && (
                <div className='admin-vagas__bulk-bar'>
                    <div className='admin-vagas__bulk-bar-left'>
                        <strong>{selectedCountLabel}</strong>
                        <span className='admin-vagas__bulk-divider' />
                        <button type='button' className='admin-vagas__bulk-export'>
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
                        <CloseRoundedIcon fontSize='small' />
                    </button>
                </div>
            )}

            {MOCK_VAGAS.length === 0 ? (
                <div className='admin-vagas__table-card'>
                    <div className='admin-vagas__empty-state'>
                        <h2>Nenhuma vaga encontrada</h2>
                    </div>
                </div>
            ) : (
                <Table<VagaDto>
                    values={paginated}
                    columns={columns}
                    getRowId={(row) => row.id}
                    selectable
                    selectedIds={selectedIds}
                    allVisibleSelected={allVisibleSelected}
                    someVisibleSelected={someVisibleSelected}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    actionColumnConfig={{
                        showView: true,
                        onView: (row) => {
                            // Modal real implementado na 18.1.4
                            console.log('Visualizar vaga:', row.id);
                        },
                    }}
                    pagination={{
                        page: safePage,
                        count: totalPages,
                        onChange: handlePageChange,
                        summaryText: `Exibindo ${startIndex + 1} a ${Math.min(
                            startIndex + PAGE_SIZE,
                            MOCK_VAGAS.length,
                        )} de ${MOCK_VAGAS.length} vagas`,
                    }}
                />
            )}
        </section>
    );
}