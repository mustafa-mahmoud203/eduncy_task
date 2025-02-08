import App from "./app.js";
import ErrorHandling from "./middlewares/globalErrorHandling.js";

let app = new App(new ErrorHandling())
app.listen()