import Checkbox from '@/components/base/Checkbox/checkbox';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CircularProgress, IconButton, Pagination, Stack } from '@mui/material';
import React from 'react';
import './index.scss';

export type TableColumn<T> = {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    sortable?: boolean;
    sortField?: string;
    headerClassName?: string;
    cellClassName?: string;
};

type ActionVisibility<T> = boolean | ((row: T) => boolean);

const resolveVisibility = <T,>(value: ActionVisibility<T> | undefined, row: T) =>
    typeof value === 'function' ? value(row) : Boolean(value);

export type TableActionColumnConfig<T> = {
    showWhatsapp?: ActionVisibility<T>;
    getWhatsappHref?: (row: T) => string;
    showView?: ActionVisibility<T>;
    onView?: (row: T) => void;
    showEdit?: ActionVisibility<T>;
    onEdit?: (row: T) => void;
    showDelete?: ActionVisibility<T>;
    onDelete?: (row: T) => void;
};

type TablePaginationConfig = {
    page: number;
    count: number;
    onChange: (page: number) => void;
    isFetching?: boolean;
    summaryText?: React.ReactNode;
};

export type TableProps<T> = {
    values: T[];
    columns: TableColumn<T>[];
    getRowId: (row: T) => string;
    className?: string;
    selectable?: boolean;
    selectedIds?: string[];
    allVisibleSelected?: boolean;
    someVisibleSelected?: boolean;
    onToggleSelect?: (rowId: string) => void;
    onToggleSelectAll?: () => void;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    onSortChange?: (field: string) => void;
    actionColumnConfig?: TableActionColumnConfig<T>;
    pagination?: TablePaginationConfig;
    backgroundHeader?: boolean;
    border?: boolean;
};

function SortButton({
    isActive,
    label,
    onClick,
    order,
}: {
    isActive: boolean;
    label: string;
    onClick: () => void;
    order?: 'asc' | 'desc';
}) {
    const icon = isActive ? (
        order === 'asc' ? (
            <KeyboardArrowUpRoundedIcon fontSize='small' />
        ) : (
            <KeyboardArrowDownRoundedIcon fontSize='small' />
        )
    ) : (
        <UnfoldMoreRoundedIcon fontSize='small' />
    );

    return (
        <button
            type='button'
            className={`custom-table__sort-button${
                isActive ? ' custom-table__sort-button--active' : ''
            }`}
            onClick={onClick}
        >
            <span>{label}</span>
            {icon}
        </button>
    );
}

export function Table<T>({
    values,
    columns,
    getRowId,
    className = '',
    selectable = false,
    selectedIds = [],
    allVisibleSelected = false,
    someVisibleSelected = false,
    onToggleSelect,
    onToggleSelectAll,
    sortField,
    sortOrder,
    onSortChange,
    actionColumnConfig,
    pagination,
    backgroundHeader = true,
    border = true,
}: TableProps<T>) {
    return (
        <div
            className={`custom-table${
                backgroundHeader ? ' custom-table--header-bg' : ''
            }${border ? '' : ' custom-table--borderless'} ${className}`.trim()}
        >
            <div className='custom-table__wrapper'>
                <table className='custom-table__element'>
                    <thead>
                        <tr>
                            {selectable && (
                                <th className='custom-table__checkbox-column'>
                                    <Checkbox
                                        checked={allVisibleSelected}
                                        indeterminate={someVisibleSelected}
                                        onChange={() => onToggleSelectAll?.()}
                                    />
                                </th>
                            )}
                            {columns.map((column) => {
                                const field = column.sortField ?? column.key;
                                const isActive = sortField === field;

                                return (
                                    <th
                                        key={column.key}
                                        className={column.headerClassName}
                                    >
                                        {column.sortable && onSortChange ? (
                                            <SortButton
                                                isActive={isActive}
                                                label={column.header}
                                                order={sortOrder}
                                                onClick={() =>
                                                    onSortChange(field)
                                                }
                                            />
                                        ) : (
                                            column.header
                                        )}
                                    </th>
                                );
                            })}
                            {actionColumnConfig && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((row) => {
                            const rowId = getRowId(row);

                            return (
                                <tr key={rowId}>
                                    {selectable && (
                                        <td className='custom-table__checkbox-column'>
                                            <Checkbox
                                                checked={selectedIds.includes(
                                                    rowId,
                                                )}
                                                onChange={() =>
                                                    onToggleSelect?.(rowId)
                                                }
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td
                                            key={`${rowId}-${column.key}`}
                                            className={column.cellClassName}
                                        >
                                            {column.render(row)}
                                        </td>
                                    ))}
                                    {actionColumnConfig && (
                                        <td>
                                            <div className='custom-table__actions'>
                                                {resolveVisibility(
                                                    actionColumnConfig.showWhatsapp,
                                                    row,
                                                ) &&
                                                    actionColumnConfig.getWhatsappHref && (
                                                        <IconButton
                                                            className='custom-table__action-button'
                                                            component='a'
                                                            href={actionColumnConfig.getWhatsappHref(
                                                                row,
                                                            )}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                        >
                                                            <WhatsAppIcon fontSize='small' />
                                                        </IconButton>
                                                    )}

                                                {resolveVisibility(
                                                    actionColumnConfig.showView,
                                                    row,
                                                ) &&
                                                    actionColumnConfig.onView && (
                                                        <IconButton
                                                            className='custom-table__action-button'
                                                            onClick={() =>
                                                                actionColumnConfig.onView?.(
                                                                    row,
                                                                )
                                                            }
                                                        >
                                                            <VisibilityOutlinedIcon fontSize='small' />
                                                        </IconButton>
                                                    )}

                                                {resolveVisibility(
                                                    actionColumnConfig.showEdit,
                                                    row,
                                                ) &&
                                                    actionColumnConfig.onEdit && (
                                                        <IconButton
                                                            className='custom-table__action-button'
                                                            onClick={() =>
                                                                actionColumnConfig.onEdit?.(
                                                                    row,
                                                                )
                                                            }
                                                        >
                                                            <EditOutlinedIcon fontSize='small' />
                                                        </IconButton>
                                                    )}

                                                {resolveVisibility(
                                                    actionColumnConfig.showDelete,
                                                    row,
                                                ) &&
                                                    actionColumnConfig.onDelete && (
                                                        <IconButton
                                                            className='custom-table__action-button custom-table__action-button--danger'
                                                            onClick={() =>
                                                                actionColumnConfig.onDelete?.(
                                                                    row,
                                                                )
                                                            }
                                                        >
                                                            <DeleteOutlineRoundedIcon fontSize='small' />
                                                        </IconButton>
                                                    )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className='custom-table__footer'>
                    <p>{pagination.summaryText}</p>
                    <Stack direction='row' spacing={1} alignItems='center'>
                        {pagination.isFetching && (
                            <CircularProgress size={16} />
                        )}
                        <Pagination
                            page={pagination.page}
                            count={pagination.count}
                            onChange={(_, nextPage) =>
                                pagination.onChange(nextPage)
                            }
                            shape='rounded'
                            color='primary'
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
}
