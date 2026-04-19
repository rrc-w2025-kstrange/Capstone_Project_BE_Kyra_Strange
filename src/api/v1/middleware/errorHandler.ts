import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(err.stack);

    if (err instanceof AppError) {
        res.status(err.statusCode).json(
            errorResponse(err.message, err.code)
        );
        return; 
    }

    // Handle unknown errors
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
    );
};

export default errorHandler;