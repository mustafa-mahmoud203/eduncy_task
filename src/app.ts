import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from "compression";

import AppError from './utils/appError.js';
import ErrorHandling from './middlewares/globalErrorHandling.js';
import contactsRoutes from "./routers/contact.js"
class App {
    private app: Express;
    private port: number;
    constructor(
        private errorHandling: ErrorHandling
    ) {
        this.app = express()
        this.port = parseInt(process.env.PORT || '3000', 10);

        this.setMiddleware();
        this.initRoutes()
        this.setErrorHandling()
    }
    setMiddleware() {
        this.app.use(compression());

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: "Too many requests from this IP, please try again later.",
        });
        this.app.use(limiter);

        this.app.use(
            cors({
                origin: process.env.CORS_ORIGIN,
                methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            })
        );
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    initRoutes() {
        this.app.use("/contacts", contactsRoutes);
    }
    setErrorHandling() {
        this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
            return next(new AppError("Page Not Found", 404));
        });

        this.app.use(this.errorHandling.globalErrorHandling)
    }

    public async listen() {
        this.app.listen(this.port, () =>
            console.log(`Server listening on port ${this.port}!`)
        );
    }
}
export default App