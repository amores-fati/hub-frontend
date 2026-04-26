import React, { createContext, useContext, useMemo, PropsWithChildren } from 'react';
import { useStore } from 'zustand';
import { createStore, StoreApi } from 'zustand/vanilla';
import { Cells } from '@/components/base/Table2/types';
import { ROWS_PER_PAGE_OPTIONS } from '../components/base/Table2/Paginator/paginator';

export type SortDirection = 'asc' | 'desc';

export type ID = number | string;

export type Paginator = {
    page: number;
    itemsCount: number;
    rowsPerPage: number;
    orderDirection: SortDirection;
    orderColumn: string;
    from: number;
    to: number;
    isLoading: boolean;
}

export type RowsPerPage = {
    value: number;
    label: string;
}


// Define your state and actions
export type State<T> = {
    error: boolean;
    cells: Cells<T>[];
    content: (T & { id: number | string })[];
    paginator: Paginator;
    selectedRows: { [key: ID]: T }
    allPagesSelected: boolean;
};

export type Action<T> = {
    setSelectedRows: (selectedRows: { [key: ID]: T }) => void;
    selectAllPages: (selectedAllPages: boolean) => void;
    setIsLoading: (paginator: State<T>['paginator']['isLoading']) => void;
    setError: () => void;
    setCells: (cells: Cells<T>[]) => void;
    setContent: (content: (T & { id: number | string })[]) => void;
    setPaginator: (
        paginator: Partial<State<T>['paginator']> | ((prev: State<T>['paginator']) => Partial<State<T>['paginator']>)
    ) => void;
    setSort: (orderColumn: string, orderDirection: SortDirection) => void;
    reset: () => void;
};

type Store<T> = StoreApi<State<T> & Action<T>>;

// Factory to create a new store
export function createTableStoreProvider<T>() {
    return createStore<State<T> & Action<T>>((set) => ({
        error: false,
        cells: [],
        content: [],
        paginator: {
            isLoading: true,
            page: 1,
            itemsCount: 0,
            rowsPerPage: ROWS_PER_PAGE_OPTIONS[3].value,
            orderDirection: 'desc' as SortDirection,
            orderColumn: 'id',
            from: 0,
            to: 0,
        },
        selectedRows: {},
        allPagesSelected: false,
        setIsLoading: (isLoading) =>
            set((state) => ({ ...state, paginator: { ...state.paginator, isLoading: isLoading } })),
        setSelectedRows: (selectedRows) =>
            set((state) => ({ ...state, selectedRows: { ...selectedRows } })),
        selectAllPages: (allPagesSelected) =>
            set({ allPagesSelected: allPagesSelected }),
        setSort: (orderColumn, orderDirection) => set((state) => ({ paginator: { ...state.paginator, orderColumn, orderDirection } })),
        setError: () =>
            set((state) => ({
                ...state,
                error: true,
                paginator: { ...state.paginator, isLoading: false, itemsCount: 0, content: [], page: 1 },
            })),
        setCells: (cells) => set({ cells }),
        setContent: (content) => set({ content, error: false }),
        setPaginator: (paginatorOrFn) =>
            set((state) => {
                const update = typeof paginatorOrFn === 'function' ? paginatorOrFn(state.paginator) : paginatorOrFn;

                return {
                    error: false,
                    paginator: {
                        ...state.paginator,
                        ...update,
                    },
                };
            }),
        reset: () =>
            set((state) => {
                return {
                    error: false,
                    cells: [],
                    content: [],
                    paginator: {
                        ...state.paginator,
                        isLoading: false,
                        page: 1,
                        itemsCount: 0,
                        from: 0,
                        to: 0,
                        filters: {},
                    },
                };
            }),
    }));
}

// Create a typed context
const TableStoreContext = createContext<Store<any> | null>(null);

// Provider
export function TableStoreProvider({ children }: PropsWithChildren) {
    const store = useMemo(() => createTableStoreProvider(), []);
    return (
        <TableStoreContext.Provider value={store}>
            {children}
        </TableStoreContext.Provider>
    );
};

// Hook to use the store with selector
export const useTableStore = <T, S>(
    selector: (state: State<T> & Action<T>) => S
): S => {
    const store = useContext(TableStoreContext);
    if (!store) throw new Error('useTableStore must be used within a TableStoreProvider');
    return useStore(store, selector as (state: State<any> & Action<any>) => S);
};

// TableStoreProvider.tsx
export const useTableStoreApi = () => {
    const store = useContext(TableStoreContext);
    if (!store) throw new Error('useTableStore must be used within a TableStoreProvider');
    return store; // expõe getState, setState, subscribe
};
