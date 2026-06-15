'use client';

import { Input } from '@/components/base';
import { Collapse } from '@mui/material';
import {
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    SearchRounded as SearchRoundedIcon,
    FilterListRounded as FilterListRoundedIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
    EditOutlined as EditOutlinedIcon,
    CloseRounded as CloseRoundedIcon,
    WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ExportFormatModal } from '@/components/ExportFormatModal/ExportFormatModal';
import { ReportFormat } from '@/services/api/admin/reports';
import './index.scss';

const PAGE_SIZE = 10;

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

const getPageNumbers = (current: number, total: number): (number | '...')[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
    )
        pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
};

export default function AdminCompanies() {
    const [search, setSearch] = useState('');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [filterEstado, setFilterEstado] = useState('');
    const [filterCidade, setFilterCidade] = useState('');
    const [filterData, setFilterData] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [applied, setApplied] = useState<AppliedFilters>(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

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
        const list =
            selected.size > 0
                ? companiesFiltered.filter((c) => selected.has(c.id))
                : companiesFiltered;
        if (format === 'csv') exportToCSV(list);
        else exportToPDF(list);
        setExportModalOpen(false);
    };

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

    const companiesFiltered = MOCK_COMPANIES.filter((c) => {
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

    const totalPages = Math.max(
        1,
        Math.ceil(companiesFiltered.length / PAGE_SIZE),
    );
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const companiesPage = companiesFiltered.slice(
        pageStart,
        pageStart + PAGE_SIZE,
    );

    const selectedOnPage = companiesPage.filter((c) => selected.has(c.id));
    const allPageSelected =
        companiesPage.length > 0 &&
        selectedOnPage.length === companiesPage.length;
    const somePageSelected = selectedOnPage.length > 0 && !allPageSelected;

    useEffect(() => {
        if (selectAllRef.current)
            selectAllRef.current.indeterminate = somePageSelected;
    }, [somePageSelected]);

    const handleEstadoChange = (state: string) => {
        setFilterEstado(state);
        setFilterCidade('');
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
        setSelected(new Set());
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearch('');
        setFilterEstado('');
        setFilterCidade('');
        setFilterData('');
        setFilterStatus('');
        setApplied(initialFilters);
        setSelected(new Set());
        setCurrentPage(1);
        setAdvancedOpen(false);
    };

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (allPageSelected) {
            setSelected((prev) => {
                const next = new Set(prev);
                companiesPage.forEach((c) => next.delete(c.id));
                return next;
            });
        } else {
            setSelected((prev) => {
                const next = new Set(prev);
                companiesPage.forEach((c) => next.add(c.id));
                return next;
            });
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        setSelected(new Set());
    };

    const displayFrom = companiesFiltered.length === 0 ? 0 : pageStart + 1;
    const displayTo = Math.min(pageStart + PAGE_SIZE, companiesFiltered.length);

    return (
        <div className='ac'>
            {/* ── Header ── */}
            <div className='ac__header'>
                <div className='ac__header-text'>
                    <h1 className='ac__title'>Gestão de Empresas</h1>
                    <p className='ac__subtitle'>
                        Administração centralizada das{' '}
                        <span className='ac__subtitle--highlight'>
                            empresas
                        </span>{' '}
                        parceiras do instituto.
                    </p>
                </div>
                <div className='ac__header-actions'>
                    <div
                        className='ac__btn ac__btn--outline'
                        onClick={() => setExportModalOpen(true)}
                    >
                        <FileDownloadOutlinedIcon
                            sx={{ fontSize: 16, color: '#1d1d1d' }}
                        />
                        <span>Exportar Lista</span>
                    </div>
                </div>
            </div>

            {/* ── Search & Filters ── */}
            <div className='ac__card ac__filters'>
                <div className='ac__search-row'>
                    <div className='ac__search-input-wrap'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Buscar por razão social, CNPJ, email...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>
                    <div
                        className='ac__btn ac__btn--filled'
                        onClick={applyFilters}
                    >
                        <SearchRoundedIcon
                            sx={{ fontSize: 16, color: '#fff' }}
                        />
                        <span>Buscar</span>
                    </div>
                    <div
                        className='ac__btn ac__btn--outline'
                        onClick={clearFilters}
                    >
                        <span>Limpar</span>
                    </div>
                </div>

                <button
                    type='button'
                    className='ac__advanced-toggle'
                    onClick={() => setAdvancedOpen((v) => !v)}
                >
                    <span className='ac__advanced-toggle-label'>
                        <FilterListRoundedIcon
                            sx={{ fontSize: 18, color: '#673ab7' }}
                        />
                        Filtros Avançados
                    </span>
                    <span
                        className={`ac__chevron${advancedOpen ? ' ac__chevron--open' : ''}`}
                    >
                        <KeyboardArrowDownRoundedIcon
                            sx={{ fontSize: 16, color: '#673ab7' }}
                        />
                    </span>
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

            {/* ── Bulk bar ── */}
            {selected.size > 0 && (
                <div className='ac__bulk-bar'>
                    <div className='ac__bulk-left'>
                        <span className='ac__bulk-count'>
                            {selected.size} empresa
                            {selected.size !== 1 ? 's' : ''} selecionada
                            {selected.size !== 1 ? 's' : ''}
                        </span>
                        <div className='ac__bulk-divider' />
                        <button type='button' className='ac__bulk-action'>
                            <FileDownloadOutlinedIcon
                                sx={{ fontSize: 14, color: '#1d1d1d' }}
                            />
                            <span>Exportar selecionados</span>
                        </button>
                    </div>
                    <button
                        type='button'
                        className='ac__icon-btn'
                        onClick={() => setSelected(new Set())}
                    >
                        <CloseRoundedIcon
                            sx={{ fontSize: 16, color: '#0b1215' }}
                        />
                    </button>
                </div>
            )}

            {/* ── Table ── */}
            <div className='ac__table-card'>
                <div className='ac__row ac__row--head'>
                    <div className='ac__col ac__col--cb'>
                        <input
                            ref={selectAllRef}
                            type='checkbox'
                            className='ac__checkbox'
                            checked={allPageSelected}
                            onChange={toggleSelectAll}
                        />
                    </div>
                    <div className='ac__col'>EMPRESA</div>
                    <div className='ac__col'>CNPJ</div>
                    <div className='ac__col'>CONTATO</div>
                    <div className='ac__col'>LOCALIZAÇÃO</div>
                    <div className='ac__col'>STATUS</div>
                    <div className='ac__col'>AÇÕES</div>
                </div>

                {companiesPage.length === 0 ? (
                    <div className='ac__empty'>Nenhuma empresa encontrada</div>
                ) : (
                    companiesPage.map((company) => (
                        <div key={company.id} className='ac__row ac__row--data'>
                            <div className='ac__col ac__col--cb'>
                                <input
                                    type='checkbox'
                                    className='ac__checkbox'
                                    checked={selected.has(company.id)}
                                    onChange={() => toggleSelect(company.id)}
                                />
                            </div>
                            <div className='ac__col'>
                                <div className='ac__company-cell'>
                                    <div className='ac__avatar'>
                                        {getInitials(company.name)}
                                    </div>
                                    <span className='ac__company-name'>
                                        {company.name}
                                    </span>
                                </div>
                            </div>
                            <div className='ac__col'>
                                <div className='ac__cnpj'>{company.cnpj}</div>
                            </div>
                            <div className='ac__col'>
                                <div className='ac__contact'>
                                    <span className='ac__contact-email'>
                                        {company.email}
                                    </span>
                                    <span className='ac__contact-phone'>
                                        {company.phone}
                                    </span>
                                </div>
                            </div>
                            <div className='ac__col'>
                                <span className='ac__location'>
                                    {company.city}, {company.state}
                                </span>
                            </div>
                            <div className='ac__col'>
                                <span
                                    className={`ac__status ac__status--${company.status === 'ATIVO' ? 'active' : 'inactive'}`}
                                >
                                    {company.status}
                                </span>
                            </div>
                            <div className='ac__col'>
                                <div className='ac__actions'>
                                    <button
                                        type='button'
                                        className='ac__icon-btn ac__icon-btn--whatsapp'
                                        onClick={() => handleWhatsApp(company)}
                                    >
                                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                                    </button>
                                    <button
                                        type='button'
                                        className='ac__icon-btn'
                                        onClick={handleEdit}
                                    >
                                        <EditOutlinedIcon
                                            sx={{
                                                fontSize: 16,
                                                color: '#1d1d1d',
                                            }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Footer / Paginação */}
                <div className='ac__footer'>
                    <span className='ac__footer-count'>
                        Exibindo {displayFrom} a {displayTo} de{' '}
                        {companiesFiltered.length} empresa
                        {companiesFiltered.length !== 1 ? 's' : ''}
                    </span>
                    <div className='ac__pagination'>
                        <button
                            type='button'
                            className='ac__page-btn ac__page-btn--outline'
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Anterior
                        </button>

                        {getPageNumbers(currentPage, totalPages).map((p, i) =>
                            p === '...' ? (
                                <span
                                    key={`ellipsis-${i}`}
                                    className='ac__page-ellipsis'
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    type='button'
                                    className={`ac__page-btn${p === currentPage ? ' ac__page-btn--active' : ' ac__page-btn--ghost'}`}
                                    onClick={() => goToPage(Number(p))}
                                >
                                    {p}
                                </button>
                            ),
                        )}

                        <button
                            type='button'
                            className='ac__page-btn ac__page-btn--outline'
                            disabled={currentPage === totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            </div>

            <ExportFormatModal
                open={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExportWithFormat}
            />
        </div>
    );
}
