import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ValidationError) {
        res
            .status(400)
            .json({
                message: err.message,
            });
    }
}