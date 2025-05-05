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
