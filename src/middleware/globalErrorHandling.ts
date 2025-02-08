import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
}

class ErrorHandling {
    public globalErrorHandling(err: CustomError, req: Request, res: Response, next: NextFunction): any {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        if (err) {
            return res.status(statusCode).json({
                status: "error",
                statusCode,
                message,
                stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

            })
        }
    }
}

export default ErrorHandling