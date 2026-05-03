export type ListWrapperDto<T> = {
    items: T[];
};

export type PaginatedDto<T> = ListWrapperDto<T> & {
    meta: {
        page: number;
        total: number;
        pageSize: number;
        totalPages: number;
    };
};
