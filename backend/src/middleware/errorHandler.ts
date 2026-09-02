import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors";
import { ZodError } from "zod";

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
    return res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'No matching route'
        }
    })
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {

    const pgCode = err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message
            }
        })

    } else if (err instanceof ZodError) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                details: err.flatten().fieldErrors
            }
        })
    } else if (err &&
            typeof err === 'object' &&
            'code' in err &&
            (err as { code?: string }).code === '23505') {

        return res.status(409).json({
            error: {
                code: "CONFLICT",
                message: "Request conflict with the current state of the target resource."
            }
        })
    } else if (pgCode === "23505") {
        return res.status(409).json({
            error: {
                code: "CONFLICT",
                message: "request conflict with the current state of the target resource."
            }
        })
    } else if (pgCode === "23503") {
        return res.status(400).json({
            error: {
                code: "INVALID_REFERENCE",
                message: "A referenced record does not exist."
            }
        })
    } else {
        req.log.error({ err }, 'unhandled error')

        return res.status(500).json({
            error: {
                code: 'INTERNAL',
                message: 'Internal server error.'
            }
        })
    }
};
