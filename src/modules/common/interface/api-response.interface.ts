export interface ApiResponse<T> {
    success: boolean;
    message: string;
    code: string;
    data?: T;
    timestamp?: string;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
    success: true;
    data: T;
}

export interface ErrorResponse extends ApiResponse<never> {
    success: false;
    data?: never;
}

export type DefaultSuccessResponse = SuccessResponse<unknown>;
export type DefaultErrorResponse = ErrorResponse;