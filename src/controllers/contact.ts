import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";
import IContact from "../interfaces/contact.js";


class ContactsController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { first_name, last_name, email, company, balance }: IContact = req.body;
            const contact: IContact | null = await prisma.contact.findFirst({
                where: {
                    email,
                    company
                }
            })
            if (contact) return next(new AppError(`Email already exists in ${company} Company`, 409))

            const newContact: IContact = await prisma.contact.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    company,
                    balance: balance ? new Prisma.Decimal(balance) : new Prisma.Decimal(0),
                },
            });

            return res.status(201).json({ message: "Done", data: newContact });

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }


}

export default ContactsController