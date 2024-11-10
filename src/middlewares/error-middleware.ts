import { Request, Response, NextFunction } from "express";
import ResponseError from "../errors/ResponseError";

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message,
        });
    } else {
        res.status(500).json({
            errors: err.message || "Internal Server Error",
        }).end();
    }
};

export { errorMiddleware };