import { body, param, query } from 'express-validator';
import validationMiddleware from '../middlewares/validation.js';

class ContactValidation {
    public addContact() {
        return [
            body("first_name")
                .notEmpty().withMessage("First name is required")
                .isString().withMessage("First name must be a string"),

            body("last_name")
                .notEmpty().withMessage("Last name is required")
                .isString().withMessage("Last name must be a string"),

            body("email")
                .notEmpty().withMessage("Email is required")
                .isEmail().withMessage("Invalid email format"),

            body("company")
                .notEmpty().withMessage("Company name is required")
                .isString().withMessage("Company name must be a string"),

            body("balance").optional().isFloat().withMessage("Balance must be a Decimal").custom(val => {
                if (val < 0) throw new Error("Balance cannot be negative");
                return true;
            }),
            body("isDeleted")
                .optional()
                .isBoolean().withMessage("isDeleted must be a boolean"),
            validationMiddleware
        ];
    }

    public getContacts() {
        return [
            query("company")
                .optional()
                .isString()
                .withMessage("Company name must be a string"),

            query("is_deleted")
                .optional()
                .custom((val) => {
                    if (val !== "true" && val !== "false") {
                        throw new Error("isDeleted must be a boolean (true or false)");
                    }
                    return true;
                }),

            query("created_after")
                .optional()
                .custom((val) => {
                    if (typeof val !== "string" || isNaN(new Date(val).getTime())) {
                        throw new Error("created_after must be a valid Date");
                    }
                    return true;
                }),


            validationMiddleware
        ];
    }

    public getContact() {
        return [
            param("id")
                .notEmpty().withMessage("ID is required")
                .isUUID().withMessage("Invalid ID format"),
            validationMiddleware
        ];
    }

}

export default ContactValidation