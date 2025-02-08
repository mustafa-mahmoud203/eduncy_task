import express, { Express, Request, Response, NextFunction } from 'express';
import 'dotenv/config';

class App {
    private app: Express;
    private port: number;
    constructor() {
        this.app = express()
        this.port = this.port = parseInt(process.env.PORT || '3000', 10);


    }


    public async listen() {
        this.app.listen(this.port, () =>
            console.log(`Server listening on port ${this.port}!`)
        );
    }
}
export default App