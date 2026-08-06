import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from "../errors";
import { verifyToken } from "../auth";

declare global {
    namespace Express {
        interface Request {
            caregiverId?: number;
        }
    }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {

    const header = req.header("authorization");

    if (header && header.startsWith("Bearer ")) {
        const token = header.substring(7);

        try {
            const payload = verifyToken(token);
            req.caregiverId = Number(payload.sub);
            next();
        } catch (err) {
            const reason = err instanceof Error ? err.name : "unknown";

            if (reason === "TokenExpiredError") {
                req.log.info({ reason }, "auth rejected")
            } else {
                req.log.warn({ reason }, "auth rejected");
            }

            next(new UnauthorizedError("Invalid or expired token"));
        }
    } else {
        next(new UnauthorizedError("Missing or malformed Authorization header"));
    }
};
