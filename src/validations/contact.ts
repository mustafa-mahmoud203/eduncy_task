import { body, param, query } from 'express-validator';
import validationMiddleware from '../middlewares/validation.js';

class ContactValidation {
    public checkIdOnly() {
        return [
            param("id")
                .notEmpty().withMessage("ID is required")
                .isUUID().withMessage("Invalid ID format"),
            validationMiddleware
        ];
    }
   
    public addContact() {
        return [
            body("first_name")
                .notEmpty().withMessage("First name is required")
                .isString().withMessage("First name must be a string")
                .isLength({ min: 3 })
                .withMessage("First name must be at least 3 characters")
                .isLength({ max: 12 })
                .withMessage("First name must be at most 12 characters"),

            body("last_name")
                .notEmpty().withMessage("Last name is required")
                .isString().withMessage("Last name must be a string")
                .isLength({ min: 3 })
                .withMessage("Last name must be at least 3 characters")
                .isLength({ max: 12 })
                .withMessage("Last name must be at most 12 characters"),

            body("email")
                .notEmpty().withMessage("Email is required")
                .isEmail().withMessage("Invalid email format"),

            body("company")
                .notEmpty().withMessage("Company name is required")
                .isString().withMessage("Company name must be a string")
                .isLength({ min: 3 })
                .withMessage("company must be at least 3 characters")
                .isLength({ max: 35 })
                .withMessage("company must be at most 35 characters"),

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


    public updateContact() {
        return [
            param("id")
                .notEmpty().withMessage("ID is required")
                .isUUID().withMessage("Invalid ID format"),
            body("first_name")
                .optional()
                .isString().withMessage("First name must be a string")
                .isLength({ min: 3 })
                .withMessage("First name must be at least 3 characters")
                .isLength({ max: 12 })
                .withMessage("First name must be at most 12 characters"),

            body("last_name")
                .optional()
                .isString().withMessage("Last name must be a string")
                .isLength({ min: 3 })
                .withMessage("Last name must be at least 3 characters")
                .isLength({ max: 12 })
                .withMessage("Last name must be at most 12 characters"),

            body("email")
                .optional()
                .isEmail().withMessage("Invalid email format"),

            body("company")
                .optional()
                .isString().withMessage("Company name must be a string")
                .isLength({ min: 3 })
                .withMessage("company must be at least 3 characters")
                .isLength({ max: 35 })
                .withMessage("company must be at most 35 characters"),

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



}

export default ContactValidation