import express, { Express, Request, Response, NextFunction } from 'express';
import AppError from './utils/appError.js';
import ErrorHandling from './middleware/globalErrorHandling.js';
import cors from 'cors';

class App {
    private app: Express;
    private port: number;
    constructor(
        private errorHandling: ErrorHandling
    ) {
        this.app = express()
        this.port = this.port = parseInt(process.env.PORT || '3000', 10);

        this.setMiddleware();
        // this.initRoutes()
        this.setErrorHandling()
    }
    setMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(
            cors({
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            })
        );
    }
    
    // initRoutes() {
    // }
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