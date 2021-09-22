export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    data: T;
    pagination: Pagination;

    constructor(data: T, pagination: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingParams {
    pageNumber;
    pageSize;

    constructor(pageNumber = 1, pageSize = 2) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}