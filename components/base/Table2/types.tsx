import { ReactNode } from 'react';

export enum CellType {
    TEXT = 'text',
    NUMBER = 'number',
    CHIP = 'chip',
    CHECKBOX = 'checkbox',
    ACTIONS = 'actions',
}

export type Cells<T> = {
    key: keyof (T & { id: number | string; actions: any });
    header: string;
    type?: CellType;
    // type: CellType;
    render?: (row: T & { id: number | string; actions: any }) => ReactNode;
    sortable: boolean;
};
