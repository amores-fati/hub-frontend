import React, { useEffect } from 'react';

import './index.scss';
import { useTableStore, Paginator } from '@/stores/TableStoreProvider';

export const ROWS_PER_PAGE_OPTIONS = [
    { value: 20, label: '20' },
    { value: 50, label: '50' },
];

const getFrom = (paginator: Paginator, page: number) => {
    let value = 0;
    if (paginator.itemsCount)
        value = paginator.rowsPerPage * page - (paginator.rowsPerPage - 1);
    return value;
};

const getTo = (paginator: Paginator, page: number) => {
    let value = paginator.itemsCount;
    if (paginator.rowsPerPage * page <= paginator.itemsCount) {
        value = paginator.rowsPerPage * page;
    }
    return value;
};

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
    const maxVisible = 3;
    let start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
};

export default function TablePaginator() {
    const paginator = useTableStore((state) => state.paginator);
    const setPaginator = useTableStore((state) => state.setPaginator);

    useEffect(() => {
        setPaginator({
            ...paginator,
            from: getFrom(paginator, paginator.page),
        });
    }, [paginator.page, paginator.itemsCount]);

    useEffect(() => {
        setPaginator({
            ...paginator,
            to: getTo(paginator, paginator.page),
        });
    }, [paginator.page, paginator.itemsCount]);

    useEffect(() => {
        setPaginator({
            ...paginator,
            page: paginator.page,
        });
    }, [paginator.page]);

    useEffect(() => {
        setPaginator({
            ...paginator,
            to: getTo(paginator, paginator.page),
            from: getFrom(paginator, paginator.page),
        });
    }, [paginator.page, paginator.rowsPerPage, paginator.itemsCount]);

    const totalPages = Math.ceil(paginator.itemsCount / paginator.rowsPerPage) || 1;
    const isFirst = paginator.page === 1 || paginator.page === undefined;
    const isLast = paginator.to === paginator.itemsCount;

    const setPage = (page: number) => {
        setPaginator({ ...paginator, page });
    };

    const setPagePrevious = () => {
        if (isFirst) return;
        setPaginator({ ...paginator, page: paginator.page - 1 });
    };

    const setPageNext = () => {
        if (isLast) return;
        setPaginator({ ...paginator, page: paginator.page + 1 });
    };

    const visiblePages = getVisiblePages(paginator.page, totalPages);
    const itemsLabel = paginator.itemsLabel ?? 'itens';

    return (
        <div className='paginator'>
            <p className='paginator__count'>
                Exibindo {paginator.from} a {paginator.to} de {paginator.itemsCount} {itemsLabel}
            </p>

            <div className='paginator__controls'>
                <button
                    className='paginator__nav-btn'
                    onClick={setPagePrevious}
                    disabled={isFirst || paginator.isLoading}
                >
                    Anterior
                </button>

                {visiblePages.map((num) => (
                    <button
                        key={num}
                        className={`paginator__page-btn${num === paginator.page ? ' paginator__page-btn--active' : ''}`}
                        onClick={() => setPage(num)}
                        disabled={paginator.isLoading}
                    >
                        {num}
                    </button>
                ))}

                <button
                    className='paginator__nav-btn'
                    onClick={setPageNext}
                    disabled={isLast || paginator.isLoading}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}
