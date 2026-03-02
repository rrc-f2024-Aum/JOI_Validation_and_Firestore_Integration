export interface ApiResponse<T> {
    data?: T,
    message?: string,
    count?: number,
    error?: string,
    code?: string
}

export const successResponse = <T>(
    data?: T,
    message?: string,
    count?: number
): ApiResponse<T> => ({
    message,
    count,
    data,
});

export const errorResponse = <T>(
    error: string,
    code?: string
): ApiResponse<null> => ({
    message: error,
    code
});
