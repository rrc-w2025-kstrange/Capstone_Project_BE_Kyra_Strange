/**
 * Interface representing a standard API response.
 * @template T - The type of the data property.
 */
export interface ApiResponse<T> {
    message?: string 
    data?: T 

    error?: {
        message: string;
        code: string;
    }

    success?: boolean 
    timestamp?: string 
}

/**
 * Creates a success response object.
 */
export const successResponse = <T>(
    data?: T,
    message?: string
): ApiResponse<T> => ({
    success: true, 
    message,
    data,
});

/**
 * Creates a standardized error response object.
 */
export const errorResponse = (message: string, code: string): ApiResponse<null> => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});