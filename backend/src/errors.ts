export class ApiError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message)
        this.status = status
        this.code = code
    }
}

export class ValidationError extends ApiError {
    constructor(message: string) {
        super(
            400,
            'VALIDATION_ERROR',
            message
        )
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(
            401,
            'UNAUTHORIZED',
            message
        )
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(
            404,
            'NOT_FOUND',
            message
        )
    }
}

export class ConflictError extends ApiError {
    constructor(message: string) {
        super(
            409,
            'CONFLICT',
            message
        )
    }
}

export class InternalError extends ApiError {
    constructor(message: string) {
        super(
            500,
            'INTERNAL',
            message
        )
    }
}
