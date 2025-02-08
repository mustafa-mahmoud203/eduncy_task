import express, { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

// can be reused by many routes
function validationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }

    next();
}
export default validationMiddleware
