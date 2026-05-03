import {
    KeyboardArrowLeft,
    KeyboardDoubleArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import React, { useEffect } from 'react';
import Select from 'react-select';

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

export default function TablePaginator() {
    const paginator = useTableStore((state) => state.paginator);
    const setPaginator = useTableStore((state) => state.setPaginator);

    // Validação do campo "de" do paginador
    useEffect(() => {
        setPaginator({
            ...paginator,
            from: getFrom(paginator, paginator.page),
        });
    }, [paginator.page, paginator.itemsCount]);

    // Validação do campo "até" do paginador
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

    const setPageNext = () => {
        if (paginator.to === paginator.itemsCount) return;
        setPaginator({
            ...paginator,
            page: paginator.page + 1,
        });
    };

    const setLastPage = () => {
        if (paginator.to === paginator.itemsCount) return;
        setPaginator({
            ...paginator,
            page: Math.ceil(paginator.itemsCount / paginator.rowsPerPage),
        });
    };

    const setPagePrevious = () => {
        if (paginator.page === 1 || paginator.page === undefined) return;
        setPaginator({
            ...paginator,
            page: paginator.page - 1,
        });
    };

    const setFirstPage = () => {
        if (paginator.page === 1 || paginator.page === undefined) return;
        setPaginator({
            ...paginator,
            page: 1,
            from: 1,
            to: paginator.rowsPerPage,
        });
    };

    // CSS do campo select
    const styles = {
        control: (base: any) => ({
            ...base,
            minHeight: 18,
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            padding: 0,
        }),
        clearIndicator: (base: any) => ({
            ...base,
            padding: 0,
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: '2px 2px',
        }),
    };

    const handleChange = (event: any) => {
        setPaginator({
            ...paginator,
            rowsPerPage: event.value,
            page: 1,
        });
    };

    return (
        <div className='sass-paginator'>
            <p className='sass-showing'>Linhas por página:</p>
            <div>
                <Select
                    menuPlacement='top'
                    isDisabled={paginator.isLoading}
                    styles={styles}
                    components={{ IndicatorSeparator: () => null }}
                    isClearable={false}
                    isSearchable={false}
                    options={ROWS_PER_PAGE_OPTIONS}
                    onChange={handleChange}
                    value={{
                        value: paginator.rowsPerPage,
                        label: paginator.rowsPerPage + '',
                    }}
                />
            </div>

            <p className='sass-showing'>Exibindo:</p>
            <p className='sass-showing'>
                {paginator.from}-{paginator.to} de {paginator.itemsCount} itens
            </p>
            <div
                className='sass-arrow'
                aria-disabled={
                    paginator.page === 1 || paginator.page === undefined
                }
            >
                <button onClick={setFirstPage}>
                    <KeyboardDoubleArrowLeft />
                </button>
            </div>
            <div
                className='sass-arrow'
                aria-disabled={
                    paginator.page === 1 || paginator.page === undefined
                }
            >
                <button onClick={setPagePrevious}>
                    <KeyboardArrowLeft />
                </button>
            </div>
            <div
                className='sass-arrow'
                aria-disabled={paginator.to === paginator.itemsCount}
            >
                <button onClick={setPageNext}>
                    <KeyboardArrowRight />
                </button>
            </div>
            <div
                className='sass-arrow'
                aria-disabled={paginator.to === paginator.itemsCount}
            >
                <button onClick={setLastPage}>
                    <KeyboardDoubleArrowRight />
                </button>
            </div>
        </div>
    );
}
