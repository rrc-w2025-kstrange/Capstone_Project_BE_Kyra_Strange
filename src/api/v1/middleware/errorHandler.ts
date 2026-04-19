import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";
import multer from "multer";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(err.stack);

    // Handle Multer-specific errors 
    if (err instanceof multer.MulterError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(err.message, "MULTER_ERROR")
        );
        return;
    }

    // Handle fileFilter errors (e.g. "Only .mp3, .m4a, and .mp4 files are allowed") 
    if (err instanceof Error && err.message.startsWith("Only") || 
        err instanceof Error && err.message.startsWith("File looks suspicious")) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(err.message, "INVALID_FILE")
        );
        return;
    }

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