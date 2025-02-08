import { Router, Request, Response, NextFunction } from "express";
import ContactsController from "../controllers/contact.js";


class ContactRouters {
    public router: Router;

    constructor(private contactsController: ContactsController) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {

        this.router.post("/", this.contactsController.create.bind(this.contactsController));
        this.router.get("/", this.contactsController.contacts.bind(this.contactsController));
        // this.router.get("/:id", this.contactsController.contact.bind(this.contactsController));
        // this.router.patch("/:id", this.contactsController.updateContact.bind(this.contactsController));
        // this.router.delete("/", this.contactsController.create.softDelete(this.contactsController));
        // this.router.post("/transfer", this.contactsController.transfer.bind(this.contactsController));
        // this.router.get("/:id/audit", this.contactsController.audit.bind(this.contactsController));

    }
}

export default new ContactRouters(new ContactsController()).router;
