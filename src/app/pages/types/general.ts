export interface IBaseResponse {
    success: string;
    message: string;
    data: any;
    pagination?: {
        currentPage: number;
        totalPage: number;
        limitPerPage: number;
        totalData: number;
    };
}

export interface PaginationParams {
    per_page: number;
    page: number;
    char?: string;
}