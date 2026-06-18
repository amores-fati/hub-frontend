'use client';

import { Input } from '@/components/base';
import { Collapse } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    SearchRounded as SearchRoundedIcon,
    FilterListRounded as FilterListRoundedIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
    KeyboardArrowUpRounded as KeyboardArrowUpRoundedIcon,
    EditOutlined as EditOutlinedIcon,
    WhatsApp as WhatsAppIcon,
    RestartAltRounded as RestartAltRoundedIcon,
} from '@mui/icons-material';
import { ButtonComponent } from '@/components/base/Button/button';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ExportFormatModal } from '@/components/ExportFormatModal/ExportFormatModal';
import { ReportFormat } from '@/services/api/admin/reports';
import BasicTable from '@/components/base/Table2/table';
import { Cells, CellType } from '@/components/base/Table2/types';
import {
    TableStoreProvider,
    useTableStore,
    Action,
    State,
} from '@/stores/TableStoreProvider';
import './index.scss';

type CompanyStatus = 'ATIVO' | 'INATIVO';

type Company = {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    status: CompanyStatus;
};

const MOCK_COMPANIES: Company[] = [
    {
        id: '1',
        name: 'HP',
        cnpj: '92.797.901/0001-74',
        email: 'hp@email.com',
        phone: '(11) 98888-8888',
        city: 'Florianópolis',
        state: 'Santa Catarina',
        status: 'ATIVO',
    },
    {
        id: '2',
        name: 'DELL',
        cnpj: '92.797.901/0001-74',
        email: 'dell@email.com',
        phone: '(21) 97777-7777',
        city: 'Porto Alegre',
        state: 'Rio Grande do Sul',
        status: 'ATIVO',
    },
    {
        id: '3',
        name: 'DB Server',
        cnpj: '92.797.901/0001-74',
        email: 'db@email.com',
        phone: '(31) 96666-6666',
        city: 'Florianópolis',
        state: 'Santa Catarina',
        status: 'ATIVO',
    },
    {
        id: '4',
        name: 'ADP',
        cnpj: '92.797.901/0001-74',
        email: 'adp@email.com',
        phone: '(21) 97777-7777',
        city: 'Porto Alegre',
        state: 'Rio Grande do Sul',
        status: 'ATIVO',
    },
    {
        id: '5',
        name: 'TELUS',
        cnpj: '92.797.901/0001-74',
        email: 'telus@email.com',
        phone: '(11) 98888-8888',
        city: 'Porto Alegre',
        state: 'Rio Grande do Sul',
        status: 'INATIVO',
    },
    {
        id: '6',
        name: 'IBM',
        cnpj: '11.222.333/0001-44',
        email: 'ibm@email.com',
        phone: '(11) 91111-1111',
        city: 'São Paulo',
        state: 'São Paulo',
        status: 'ATIVO',
    },
    {
        id: '7',
        name: 'Microsoft',
        cnpj: '22.333.444/0001-55',
        email: 'ms@email.com',
        phone: '(11) 92222-2222',
        city: 'São Paulo',
        state: 'São Paulo',
        status: 'ATIVO',
    },
    {
        id: '8',
        name: 'Oracle',
        cnpj: '33.444.555/0001-66',
        email: 'oracle@email.com',
        phone: '(21) 93333-3333',
        city: 'Rio de Janeiro',
        state: 'Rio de Janeiro',
        status: 'ATIVO',
    },
    {
        id: '9',
        name: 'SAP',
        cnpj: '44.555.666/0001-77',
        email: 'sap@email.com',
        phone: '(11) 94444-4444',
        city: 'Campinas',
        state: 'São Paulo',
        status: 'INATIVO',
    },
    {
        id: '10',
        name: 'Totvs',
        cnpj: '55.666.777/0001-88',
        email: 'totvs@email.com',
        phone: '(11) 95555-5555',
        city: 'São Paulo',
        state: 'São Paulo',
        status: 'ATIVO',
    },
    {
        id: '11',
        name: 'Stefanini',
        cnpj: '66.777.888/0001-99',
        email: 'stef@email.com',
        phone: '(11) 96666-6666',
        city: 'São Paulo',
        state: 'São Paulo',
        status: 'ATIVO',
    },
    {
        id: '12',
        name: 'CI&T',
        cnpj: '77.888.999/0001-00',
        email: 'cit@email.com',
        phone: '(19) 97777-7777',
        city: 'Campinas',
        state: 'São Paulo',
        status: 'ATIVO',
    },
];

type AppliedFilters = {
    search: string;
    estado: string;
    cidade: string;
    status: string;
};

const initialFilters: AppliedFilters = {
    search: '',
    estado: '',
    cidade: '',
    status: '',
};

const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

const filterCompanies = (applied: AppliedFilters): Company[] =>
    MOCK_COMPANIES.filter((c) => {
        const term = applied.search.toLowerCase();
        if (
            term &&
            !c.name.toLowerCase().includes(term) &&
            !c.cnpj.includes(term) &&
            !c.email.toLowerCase().includes(term)
        )
            return false;
        if (applied.estado && c.state !== applied.estado) return false;
        if (applied.cidade && c.city !== applied.cidade) return false;
        if (applied.status && c.status !== applied.status) return false;
        return true;
    });

export default function Index() {
    return (
        <TableStoreProvider>
            <AdminCompanies />
        </TableStoreProvider>
    );
}

function AdminCompanies() {
    const setCells = useTableStore(
        (s: State<Company> & Action<Company>) => s.setCells,
    );
    const setContent = useTableStore(
        (s: State<Company> & Action<Company>) => s.setContent,
    );
    const setPaginator = useTableStore((state) => state.setPaginator);
    const selectedCompanies = useTableStore(
        (state) => state.selectedRows,
    ) as Record<string, Company>;
    const setSelectedCompanies = useTableStore(
        (state) => state.setSelectedRows,
    );

    const [search, setSearch] = useState('');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [filterEstado, setFilterEstado] = useState('');
    const [filterCidade, setFilterCidade] = useState('');
    const [filterData, setFilterData] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [applied, setApplied] = useState<AppliedFilters>(initialFilters);
    const [exportModalOpen, setExportModalOpen] = useState(false);

    const estadosDisponiveis = [
        ...new Set(MOCK_COMPANIES.map((c) => c.state)),
    ].sort();
    const cidadesDisponiveis = (
        filterEstado
            ? MOCK_COMPANIES.filter((c) => c.state === filterEstado)
            : MOCK_COMPANIES
    )
        .reduce<string[]>((acc, c) => {
            if (!acc.includes(c.city)) acc.push(c.city);
            return acc;
        }, [])
        .sort();

    const handleWhatsApp = (company: Company) => {
        const digits = company.phone.replace(/\D/g, '');
        const number = digits.startsWith('55') ? digits : `55${digits}`;
        window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer');
    };

    const handleEdit = () => {
        toast.info('Funcionalidade disponível em breve.');
    };

    const exportToCSV = (companies: Company[]) => {
        const headers = [
            'Empresa',
            'CNPJ',
            'Email',
            'Telefone',
            'Cidade',
            'Estado',
            'Status',
        ];
        const rows = companies.map((c) => [
            c.name,
            c.cnpj,
            c.email,
            c.phone,
            c.city,
            c.state,
            c.status,
        ]);
        const csv = [headers, ...rows]
            .map((r) => r.map((v) => `"${v}"`).join(','))
            .join('\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_empresas_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportToPDF = (companies: Company[]) => {
        const win = window.open('', '_blank', 'width=1120,height=840');
        if (!win) {
            toast.error(
                'Não foi possível abrir a janela de exportação. Verifique o bloqueador de pop-up.',
            );
            return;
        }
        const rows = companies
            .map(
                (c) =>
                    `<tr><td>${c.name}</td><td>${c.cnpj}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.city}, ${c.state}</td><td>${c.status}</td></tr>`,
            )
            .join('');
        const html = `<html lang="pt-BR"><head><title>Relatório de Empresas</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1d1d1d}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border:1px solid #e0e0e0;padding:10px;text-align:left;font-size:12px}th{background:#f8f9fa}</style></head><body><h1>Gestão de Empresas</h1><p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p><p>Total: ${companies.length} empresa(s)</p><table><thead><tr><th>Empresa</th><th>CNPJ</th><th>Email</th><th>Telefone</th><th>Localização</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
        win.document.open();
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
    };

    const handleExportWithFormat = (format: ReportFormat) => {
        const selectedList = Object.values(selectedCompanies);
        const list =
            selectedList.length > 0 ? selectedList : filterCompanies(applied);
        if (format === 'csv') exportToCSV(list);
        else exportToPDF(list);
        setExportModalOpen(false);
    };

    const applyFilters = () => {
        // eslint-disable-next-line no-console
        console.log('[Buscar]', {
            search,
            estado: filterEstado,
            cidade: filterCidade,
            status: filterStatus,
        });
        setApplied({
            search,
            estado: filterEstado,
            cidade: filterCidade,
            status: filterStatus,
        });
        setSelectedCompanies({});
    };

    const clearFilters = () => {
        setSearch('');
        setFilterEstado('');
        setFilterCidade('');
        setFilterData('');
        setFilterStatus('');
        setApplied(initialFilters);
        setSelectedCompanies({});
        setAdvancedOpen(false);
    };

    const handleEstadoChange = (state: string) => {
        setFilterEstado(state);
        setFilterCidade('');
    };

    const cells: Cells<Company>[] = [
        { key: 'id', header: '', type: CellType.CHECKBOX, sortable: false },
        {
            key: 'name',
            header: 'EMPRESA',
            sortable: true,
            render: (c) => (
                <div className='ac__company-cell'>
                    <div className='ac__avatar'>{getInitials(c.name)}</div>
                    <span className='ac__company-name'>{c.name}</span>
                </div>
            ),
        },
        { key: 'cnpj', header: 'CNPJ', sortable: false },
        {
            key: 'email',
            header: 'CONTATO',
            sortable: false,
            render: (c) => (
                <div className='ac__contact'>
                    <span className='ac__contact-email'>{c.email}</span>
                    <span className='ac__contact-phone'>{c.phone}</span>
                </div>
            ),
        },
        {
            key: 'city',
            header: 'LOCALIZAÇÃO',
            sortable: false,
            render: (c) => (
                <span>
                    {c.city}, {c.state}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'STATUS',
            sortable: false,
            render: (c) => (
                <span
                    className={`ac__status ac__status--${c.status === 'ATIVO' ? 'active' : 'inactive'}`}
                >
                    {c.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            sortable: false,
            render: (c) => (
                <>
                    <IconButton
                        className='ac__icon-btn--whatsapp'
                        onClick={() => handleWhatsApp(c)}
                        size='small'
                    >
                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton onClick={handleEdit} size='small'>
                        <EditOutlinedIcon
                            sx={{ fontSize: 16, color: '#1d1d1d' }}
                        />
                    </IconButton>
                </>
            ),
        },
    ];

    useEffect(() => {
        setCells(cells);
    }, []);

    useEffect(() => {
        const filtered = filterCompanies(applied);
        setContent(filtered);
        setPaginator({ itemsCount: filtered.length, isLoading: false });
    }, [applied]);

    const selectedCount = Object.keys(selectedCompanies).length;

    return (
        <section className='ac'>
            {/* Header */}
            <div className='ac__header'>
                <div>
                    <span className='ac__eyebrow'>Area administrativa</span>
                    <h1>Gestão de Empresas</h1>
                </div>
                <div className='ac__header-action'>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setExportModalOpen(true)}
                    >
                        <span className='ac__button-content'>
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar Lista
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            {/* Filtros */}
            <div className='ac__filters-card'>
                <div className='ac__search-row'>
                    <div className='ac__search-input'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Buscar por razão social, CNPJ, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>
                    <ButtonComponent onClick={applyFilters}>
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
                    onClick={() => setAdvancedOpen((v) => !v)}
                >
                    <span>
                        <FilterListRoundedIcon fontSize='small' />
                        Filtros avançados
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
                            <label className='ac__field-label'>Estado</label>
                            <select
                                className='ac__field-select'
                                value={filterEstado}
                                onChange={(e) =>
                                    handleEstadoChange(e.target.value)
                                }
                            >
                                <option value=''>Todos os estados</option>
                                {estadosDisponiveis.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='ac__field-label'>Cidade</label>
                            <select
                                className='ac__field-select'
                                value={filterCidade}
                                onChange={(e) =>
                                    setFilterCidade(e.target.value)
                                }
                                disabled={!filterEstado}
                            >
                                <option value=''>
                                    {filterEstado
                                        ? 'Todas as cidades'
                                        : 'Selecione um estado primeiro'}
                                </option>
                                {cidadesDisponiveis.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='ac__field-label'>
                                Data de cadastro
                            </label>
                            <input
                                type='date'
                                className='ac__field-input'
                                value={filterData}
                                onChange={(e) => setFilterData(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className='ac__field-label'>
                                Status da empresa
                            </label>
                            <select
                                className='ac__field-select'
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
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

            {/* Bulk bar */}
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
                        >
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar selecionados
                        </button>
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className='ac__table-card'>
                <BasicTable<Company> />
            </div>

            <ExportFormatModal
                open={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExportWithFormat}
            />
        </section>
    );
}
