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
    public async contacts(req: Request, res: Response, next: NextFunction) {
        try {
            const { company, is_deleted, created_after } = req.query

            const isCompany = typeof company === "string" ? company : undefined;
            const isDeleted = is_deleted ? is_deleted === "true" : undefined
            const createdAfter = created_after ? new Date(created_after as string) : undefined

            const contacts: IContact[] = await prisma.contact.findMany({
                where: {
                    company: isCompany,
                    isDeleted,
                    createdAt: createdAfter ? { gte: createdAfter } : undefined

                }
            })
            return res.status(200).json({ message: "Done", data: contacts })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }
    public async contact(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const contact: IContact | null = await prisma.contact.findUnique({
                where: {
                    id
                }
            })
            if (!contact) return next(new AppError(`Contact not found`, 404))

            return res.status(200).json({ message: "Done", data: contact })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }

}

export default ContactsController