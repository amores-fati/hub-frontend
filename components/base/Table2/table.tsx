import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import Paper from '@mui/material/Paper';
import { Cells, CellType } from './types';
import React, { ReactNode, useEffect } from 'react';
import TablePaginator from './Paginator/paginator';
import { Action, ID, State, useTableStore, useTableStoreApi } from '@/stores/TableStoreProvider';
import { SortDirection } from '@/stores/TableStoreProvider'
import Checkbox from '../Checkbox/checkbox';
import { useShallow } from 'zustand/react/shallow';
import { Loading } from '../Loading/loading';

export default function BasicTable<T>() {
    const cells: Cells<T>[] = useTableStore((state) => state.cells);
    const data = useTableStore((state) => state.content) as (T & { id: number | string; actions: any })[];
    const isLoading = useTableStore((state) => (state.paginator.isLoading));

    if (isLoading) return <Loading />;

    if (!data) return <></>

    return (
        <TableContainer component={Paper} sx={{ maxHeight: '53vh', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                        {cells.map((cell: Cells<T>) => (
                            <HeaderCell key={`table-head-cell-${String(cell.key)}`} cell={cell} />
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row: (T & { id: number | string; actions: any })) => (
                        <TableRow
                            key={`table-body-row-${row.id}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {cells.map((cell: Cells<T>) => (
                                <Cell
                                    key={`table-body-row-${row.id}-cell-${String(cell.key)}`}
                                    cell={cell}
                                    row={row}
                                />
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePaginator />
        </TableContainer>
    );
}

function HeaderCell<T>({ cell }: { cell: Cells<T>; }) {
    const orderColumn = useTableStore((state) => (state.paginator.orderColumn));
    const orderDirection = useTableStore((state) => (state.paginator.orderDirection));
    const setSort = useTableStore((state) => state.setSort);
    const column = String(cell.key);

    const handleSort = () => {
        let direction: SortDirection = 'asc';
        if (column === orderColumn && orderDirection === 'asc') {
            direction = 'desc';
        }
        setSort(column, direction);
    }

    if (cell.type === CellType.CHECKBOX) {
        return (
            <CheckBoxHeader key={`table-head-cell-${String(cell.key)}`} cell={cell} />
        )
    }
    return (
        <TableCell
            key={`table-head-cell-${String(cell.key)}`}
            component="th"
            scope="row"
            align='center'
        >
            <TableSortLabel
                active={orderColumn === cell.key}
                direction={orderColumn === cell.key ? orderDirection : 'asc'}
                onClick={handleSort}
            >
                {cell.header}
            </TableSortLabel>
        </TableCell>
    )
}

// CheckBoxHeader — selectedRows inteiro não é necessário, só o count
function CheckBoxHeader<T>({ cell }: { cell: Cells<T> }) {
    const totalContent = useTableStore((state) => state.content.length);
    const selectedCount = useTableStore((state) => Object.keys(state.selectedRows).length);
    const setSelectedRows = useTableStore((state) => state.setSelectedRows);
    const content = useTableStore(useShallow((state: State<T> & Action<T>) => state.content));

    const allSelected = selectedCount === totalContent && totalContent > 0;
    const indeterminate = selectedCount > 0 && selectedCount < totalContent;

    const toggleSelectPage = () => {
        if (allSelected) {
            setSelectedRows({});
            return;
        }
        const rowsSelected: { [key: ID]: T } = {};
        for (const row of content) {
            rowsSelected[row.id] = row as T;
        }
        setSelectedRows(rowsSelected);
    };

    return (
        <TableCell
            component="th"
            scope="row"
            key={`table-head-cell-${String(cell.key)}`}
        >
            <Checkbox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={toggleSelectPage}
            />
        </TableCell>
    );
}

function Cell<T>({ cell, row }: { cell: Cells<T>; row: (T & { id: number | string; actions: any }); }) {
    if (cell.render) {
        return (
            <TableCell
                key={`table-body-row-${row.id}-cell-${String(cell.key)}`}
                align="right"
            >
                {cell.render(row)}
            </TableCell>
        )
    }

    return (
        <CustomCell
            key={`table-body-row-${row.id}-cell-${String(cell.key)}`}
            cell={cell}
            row={row}
        />
    )
}


function CustomCell<T>({ row, cell }: { row: T & { id: number | string; actions: any }; cell: Cells<T>; }): ReactNode {
    const value = row[cell.key] ?? '';
    if (value === null || value === undefined) return <TableCell>{null}</TableCell>;
    if (cell.type === CellType.NUMBER) {
        return (
            <TableCell
                key={`table-body-row-${row.id}-cell-${String(cell.key)}`}
                align="right"
            >
                {renderCellValue(row[cell.key])}
            </TableCell>
        )
    }

    if (cell.type === CellType.CHECKBOX) {
        return (
            <CheckBoxCell row={row} cell={cell} />
        )
    }

    return (
        <TableCell
            key={`table-body-row-${row.id}-cell-${String(cell.key)}`}
        >
            {renderCellValue(row[cell.key])}
        </TableCell>
    )
}

// CheckBoxCell — assina APENAS o próprio ID, sem shallow necessário (retorna boolean primitivo)
function CheckBoxCell<T>({ row }: { row: T & { id: ID; actions: any }; cell: Cells<T> }): ReactNode {
    const storeApi = useTableStoreApi();

    const selected = useTableStore((state) => !!state.selectedRows[row.id]); // boolean primitivo = sem re-render desnecessário
    const setSelectedRows = useTableStore((state) => state.setSelectedRows);

    const handleToggle = () => {
        const current = { ...storeApi.getState().selectedRows };
        if (selected) {
            delete current[row.id];
        } else {
            current[row.id] = row;
        }
        setSelectedRows(current);
    };

    return (
        <TableCell component="th" scope="row">
            <Checkbox checked={selected} indeterminate={false} onChange={handleToggle} />
        </TableCell>
    );
}

const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    return String(value);
}