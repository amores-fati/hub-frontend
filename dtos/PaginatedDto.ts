export type ListWrapperDto<T> = {
    data: T[];
};

export type PaginatedDto<T> = ListWrapperDto<T> & {
    page: number;
    total: number;
};
