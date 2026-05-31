'use client';

import { Input, Select, Table } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import { AdminCourseFormModal } from '@/components/AdminCourseFormModal';
import { AdminCourseDto, AdminCourseModality } from '@/dtos/AdminCourseDto';
import { getAdminCoursesMock } from '@/services/api/admin/courses/mock';
import {
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ButtonComponent } from '@/components/base/Button/button';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

const PAGE_SIZE = 5;

const MOCK_RESPONSE = getAdminCoursesMock();

const MODALITY_OPTIONS: Option[] = [
    { value: AdminCourseModality.PRESENTIAL, label: 'Presencial' },
    { value: AdminCourseModality.ONLINE, label: 'Online' },
];

const STATUS_OPTIONS: Option[] = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
];

const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

const getCourseStatus = (course: AdminCourseDto): 'ATIVO' | 'INATIVO' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${course.startDate}T00:00:00`);
    const end = new Date(`${course.endDate}T00:00:00`);
    return start <= today && today <= end ? 'ATIVO' : 'INATIVO';
};

const exportCoursesToPdf = (
    printWindow: Window | null,
    courses: AdminCourseDto[],
    title: string,
) => {
    if (!printWindow) {
        toast.error(
            'Não foi possível abrir a janela de exportação. Verifique o bloqueador de pop-up.',
        );
        return;
    }

    const generatedAt = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date());

    const rows = courses
        .map(
            (course) => `
            <tr>
                <td>${course.name}</td>
                <td>${course.modality === AdminCourseModality.PRESENTIAL ? 'Presencial' : 'Online'}</td>
                <td>${course.address ?? '-'}</td>
                <td>${getCourseStatus(course)}</td>
                <td>${formatDate(course.startDate)}</td>
                <td>${formatDate(course.endDate)}</td>
            </tr>
        `,
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
                    th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; font-size: 12px; vertical-align: top; }
                    th { background: #f8f9fa; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Data de geração: ${generatedAt}</p>
                <p>Total de cursos: ${courses.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Modalidade</th>
                            <th>Endereço</th>
                            <th>Status</th>
                            <th>Data Inicial</th>
                            <th>Data Final</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};

export function AdminCourses() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [draftModality, setDraftModality] = useState<Option | null>(null);
    const [draftStatus, setDraftStatus] = useState<Option | null>(null);
    const [appliedModality, setAppliedModality] = useState<string | null>(null);
    const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [coursePendingDelete, setCoursePendingDelete] =
        useState<AdminCourseDto | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredCourses = useMemo(() => {
        let courses = MOCK_RESPONSE.data;
        const q = appliedSearch.trim().toLowerCase();
        if (q) {
            courses = courses.filter((c) => c.name.toLowerCase().includes(q));
        }
        if (appliedModality) {
            courses = courses.filter(
                (c) => c.modality === (appliedModality as AdminCourseModality),
            );
        }
        if (appliedStatus) {
            courses = courses.filter(
                (c) => getCourseStatus(c) === appliedStatus,
            );
        }
        return courses;
    }, [appliedSearch, appliedModality, appliedStatus]);

    const total = appliedSearch.trim()
        ? filteredCourses.length
        : MOCK_RESPONSE.total;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(page * PAGE_SIZE, total);

    const visibleIds = filteredCourses.map((c) => c.id);
    const selectedVisibleCount = visibleIds.filter((id) =>
        selectedIds.includes(id),
    ).length;
    const allVisibleSelected =
        visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
    const someVisibleSelected =
        selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;

    const selectedCountLabel = `${selectedIds.length} curso${selectedIds.length === 1 ? '' : 's'} selecionado${selectedIds.length === 1 ? '' : 's'}`;

    const handleSearch = () => {
        setPage(1);
        setAppliedSearch(searchInput);
        setAppliedModality(draftModality ? String(draftModality.value) : null);
        setAppliedStatus(draftStatus ? String(draftStatus.value) : null);
    };

    const handleClear = () => {
        setSearchInput('');
        setAppliedSearch('');
        setDraftModality(null);
        setDraftStatus(null);
        setAppliedModality(null);
        setAppliedStatus(null);
        setPage(1);
        setSelectedIds([]);
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !visibleIds.includes(id)),
            );
        } else {
            setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleExportAll = () => {
        const printWindow = window.open('', '_blank', 'width=1120,height=840');
        exportCoursesToPdf(printWindow, filteredCourses, 'Gestão de Cursos');
    };

    const handleExportSelected = () => {
        const selected = filteredCourses.filter((c) =>
            selectedIds.includes(c.id),
        );
        if (selected.length === 0) {
            toast.info('Selecione pelo menos um curso para exportar.');
            return;
        }
        const printWindow = window.open('', '_blank', 'width=1120,height=840');
        exportCoursesToPdf(printWindow, selected, 'Gestão de Cursos');
    };

    const handleConfirmDelete = () => {
        setSelectedIds((prev) =>
            prev.filter((id) => id !== coursePendingDelete?.id),
        );
        setCoursePendingDelete(null);
        toast.success('Curso excluído com sucesso.');
    };

    const columns = useMemo(
        () => [
            {
                key: 'name',
                header: 'Nome',
                render: (course: AdminCourseDto) => course.name,
            },
            {
                key: 'modality',
                header: 'Modalidade',
                render: (course: AdminCourseDto) => (
                    <Chip
                        label={
                            course.modality === AdminCourseModality.PRESENTIAL
                                ? 'PRESENCIAL'
                                : 'ONLINE'
                        }
                        className={
                            course.modality === AdminCourseModality.PRESENTIAL
                                ? 'admin-courses__badge admin-courses__badge--presential'
                                : 'admin-courses__badge admin-courses__badge--online'
                        }
                    />
                ),
            },
            {
                key: 'address',
                header: 'Endereço',
                render: (course: AdminCourseDto) => (
                    <span className='admin-courses__address-cell'>
                        {course.address ?? '-'}
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                render: (course: AdminCourseDto) => {
                    const status = getCourseStatus(course);
                    return (
                        <Chip
                            label={status}
                            className={
                                status === 'ATIVO'
                                    ? 'admin-courses__badge admin-courses__badge--active'
                                    : 'admin-courses__badge admin-courses__badge--inactive'
                            }
                        />
                    );
                },
            },
            {
                key: 'startDate',
                header: 'Data Inicial',
                render: (course: AdminCourseDto) => (
                    <Chip
                        label={formatDate(course.startDate)}
                        className='admin-courses__badge admin-courses__badge--date'
                    />
                ),
            },
            {
                key: 'endDate',
                header: 'Data Final',
                render: (course: AdminCourseDto) => (
                    <Chip
                        label={formatDate(course.endDate)}
                        className='admin-courses__badge admin-courses__badge--date'
                    />
                ),
            },
        ],
        [],
    );

    return (
        <section className='admin-courses'>
            <div className='admin-courses__header'>
                <div>
                    <h1>Gestão de Cursos</h1>
                    <p>
                        Administração centralizada de{' '}
                        <span className='admin-courses__subtitle-link'>
                            cursos
                        </span>{' '}
                        disponibilizados pelo instituto.
                    </p>
                </div>

                <div className='admin-courses__header-actions'>
                    <ButtonComponent onClick={() => setShowCreateModal(true)}>
                        <span className='admin-courses__button-content'>
                            <AddRoundedIcon fontSize='small' />
                            Novo Curso
                        </span>
                    </ButtonComponent>

                    <ButtonComponent
                        variant='secondary'
                        onClick={handleExportAll}
                    >
                        <span className='admin-courses__button-content'>
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar Lista
                        </span>
                    </ButtonComponent>
                </div>
            </div>

            <div className='admin-courses__filters-card'>
                <div className='admin-courses__search-row'>
                    <div className='admin-courses__search-input'>
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            placeholder='Buscar por nome, data, modalidade...'
                            icon={<SearchRoundedIcon fontSize='small' />}
                        />
                    </div>

                    <ButtonComponent onClick={handleSearch}>
                        <span className='admin-courses__button-content'>
                            <SearchRoundedIcon fontSize='small' />
                            Buscar
                        </span>
                    </ButtonComponent>

                    <ButtonComponent variant='secondary' onClick={handleClear}>
                        Limpar
                    </ButtonComponent>
                </div>

                <button
                    type='button'
                    className='admin-courses__advanced-toggle'
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
                    <div className='admin-courses__advanced-grid'>
                        <div>
                            <label className='admin-courses__field-label'>
                                Modalidade
                            </label>
                            <Select
                                placeholder='Selecione a modalidade'
                                options={MODALITY_OPTIONS}
                                value={draftModality ?? undefined}
                                onChange={(option) => setDraftModality(option)}
                                isClearable
                            />
                        </div>
                        <div>
                            <label className='admin-courses__field-label'>
                                Status
                            </label>
                            <Select
                                placeholder='Selecione o status'
                                options={STATUS_OPTIONS}
                                value={draftStatus ?? undefined}
                                onChange={(option) => setDraftStatus(option)}
                                isClearable
                            />
                        </div>
                    </div>
                </Collapse>
            </div>

            {selectedIds.length > 0 && (
                <div className='admin-courses__bulk-bar'>
                    <strong>{selectedCountLabel}</strong>

                    <div className='admin-courses__bulk-separator' />

                    <div className='admin-courses__bulk-actions'>
                        <button type='button' onClick={() => {}}>
                            <SendRoundedIcon fontSize='small' />
                            Enviar mensagem
                        </button>

                        <button type='button' onClick={() => {}}>
                            <SyncAltRoundedIcon fontSize='small' />
                            Atualizar status
                        </button>

                        <button type='button' onClick={handleExportSelected}>
                            <FileDownloadOutlinedIcon fontSize='small' />
                            Exportar selecionados
                        </button>
                    </div>

                    <button
                        type='button'
                        className='admin-courses__bulk-close'
                        onClick={() => setSelectedIds([])}
                        aria-label='Limpar seleção'
                    >
                        <CloseRoundedIcon fontSize='small' />
                    </button>
                </div>
            )}

            <div className='admin-courses__table-card'>
                {filteredCourses.length === 0 ? (
                    <div className='admin-courses__empty-state'>
                        <h2>Nenhum curso cadastrado</h2>
                    </div>
                ) : (
                    <Table
                        values={filteredCourses}
                        columns={columns}
                        getRowId={(c) => c.id}
                        selectable
                        selectedIds={selectedIds}
                        allVisibleSelected={allVisibleSelected}
                        someVisibleSelected={someVisibleSelected}
                        onToggleSelect={toggleSelection}
                        onToggleSelectAll={toggleSelectAll}
                        actionColumnConfig={{
                            showView: true,
                            onView: () => {},
                            showEdit: true,
                            onEdit: () => {},
                            showDelete: true,
                            onDelete: setCoursePendingDelete,
                        }}
                        pagination={{
                            page,
                            count: totalPages,
                            onChange: setPage,
                            summaryText: `Exibindo ${rangeStart} a ${rangeEnd} de ${total} cursos`,
                        }}
                    />
                )}
            </div>

            <AdminCourseFormModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    toast.success('Curso cadastrado com sucesso.');
                }}
            />

            <Dialog
                open={!!coursePendingDelete}
                onClose={() => setCoursePendingDelete(null)}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle>Excluir curso</DialogTitle>
                <DialogContent dividers>
                    <p>
                        Deseja realmente excluir{' '}
                        <strong>{coursePendingDelete?.name}</strong>?
                    </p>
                </DialogContent>
                <DialogActions>
                    <ButtonComponent
                        variant='secondary'
                        onClick={() => setCoursePendingDelete(null)}
                    >
                        Cancelar
                    </ButtonComponent>
                    <ButtonComponent onClick={handleConfirmDelete}>
                        Confirmar exclusão
                    </ButtonComponent>
                </DialogActions>
            </Dialog>
        </section>
    );
}
