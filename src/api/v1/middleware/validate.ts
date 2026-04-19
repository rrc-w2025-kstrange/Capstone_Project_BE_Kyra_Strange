import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates different parts of the request
 * against separate Joi schemas and strips unknown fields appropriately.
 *
 * @param schemas - Object containing separate schemas for body, params, and query
 * @param options - Validation options for stripping behavior
 * @returns Express middleware function that performs the validation
 */
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
) => {
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            /**
             * Validates a specific part of the request (body, params, or query) against a Joi schema.
             * Collects validation errors and optionally strips unknown fields from the data.
             *
             * @param schema - Joi schema to validate against
             * @param data - The request data to validate (req.body, req.params, or req.query)
             * @param partName - Name of the request part (No longer used in prefixing to match video demo)
             * @param shouldStrip - Whether to strip unknown fields from the validated data
             * @returns The original data if validation fails or stripping is disabled, otherwise the stripped/validated data
             */
            const validatePart = (
                schema: ObjectSchema,
                data: any,
                partName: string,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: true, 
                    stripUnknown: shouldStrip,
                });

                if (error) {
                    throw new Error(error.details[0].message);
                }
                
                return shouldStrip ? value : data;
            };

            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                );
            }

            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                );
            }

            next();
            return;
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: error.message,
            });
            return;
        }
    };
};