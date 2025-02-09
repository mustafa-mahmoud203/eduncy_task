import { Router } from "express";
import ContactsController from "../controllers/contact.js";
import ContactValidation from "../validations/contact.js";


class ContactRouters {
    public router: Router;

    constructor(private contactsController: ContactsController, private contactValidation: ContactValidation) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {

        this.router.post("/", this.contactValidation.addContact(), this.contactsController.create.bind(this.contactsController));
        this.router.get("/", this.contactValidation.getContacts(), this.contactsController.contacts.bind(this.contactsController));
        this.router.get("/:id", this.contactValidation.getContact(), this.contactsController.contact.bind(this.contactsController));
        this.router.patch("/:id", this.contactValidation.updateContact(), this.contactsController.updateContact.bind(this.contactsController));
        this.router.delete("/:id", this.contactValidation.deleteContact(), this.contactsController.softDelete.bind(this.contactsController));
        // this.router.post("/transfer", this.contactsController.transfer.bind(this.contactsController));
        // this.router.get("/:id/audit", this.contactsController.audit.bind(this.contactsController));

    }
}

export default new ContactRouters(new ContactsController(), new ContactValidation()).router;
