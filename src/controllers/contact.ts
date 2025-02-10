import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";
import IContact from "../interfaces/contact.js";
import ITransfer from "../interfaces/transfer.js";
import getChanges from "../utils/getUpdateChanges.js";


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
            const isDeleted = is_deleted ? is_deleted === "true" : false
            const createdAfter = created_after ? new Date(created_after as string) : undefined

            const limit: number = parseInt(req.query.limit as string) || 50;
            const page: number = parseInt(req.query.page as string) || 1
            const skip: number = (page - 1) * limit

            const contacts: IContact[] = await prisma.contact.findMany({
                skip,
                take: limit,
                where: {
                    company: isCompany,
                    isDeleted,
                    createdAt: createdAfter ? { gte: createdAfter } : undefined

                }
            })
            return res.status(200).json({ message: "Done", length: contacts.length, data: contacts })

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
    public async updateContact(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const data: Partial<IContact> = req.body

            const contact: IContact | null = await prisma.contact.findFirst({
                where: {
                    id
                }
            })
            if (!contact) return next(new AppError(`Contact not found`, 404))

            //if clint sent email only
            if (data.email && !data.company) {
                const existingEmail = await prisma.contact.findFirst({
                    where: {
                        email: data.email,
                        company: contact.company,
                        id: { not: id }
                    }
                })
                if (existingEmail) {
                    return next(new AppError(`Email already exists in ${contact.company} Company`, 409));
                }
            }
            //if clint sent company only
            if (data.company && !data.email) {
                const existingCompany = await prisma.contact.findFirst({
                    where: {
                        email: contact.email,
                        company: data.company,
                        id: { not: id }
                    }
                });

                if (existingCompany) {
                    return next(new AppError(`Email already exists in ${data.company} Company`, 409));
                }
            }

            if (data.email && data.company) {
                const existingBoth = await prisma.contact.findFirst({
                    where: {
                        email: data.email,
                        company: data.company,
                        id: { not: id }
                    }
                });

                if (existingBoth) {
                    return next(new AppError(`Email already exists in ${data.company} Company`, 409));
                }
            }

            // update contact
            const updatedContact = await prisma.contact.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            })

            // compair updates
            const changes = getChanges(contact, data);

            // add updates to audiolog
            if (Object.keys(changes).length > 0) {
                await prisma.auditLog.create({
                    data: {
                        changeType: "UPDATE",
                        contactID: id,
                        changes,
                        timestamp: new Date()
                    }
                })
            }

            return res.status(200).json({ message: "Done", data: updatedContact })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }

    public async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const contact: IContact | null = await prisma.contact.findUnique({
                where: {
                    id
                }
            })
            if (!contact) return next(new AppError(`Contact not found`, 404))

            if (contact.isDeleted) {
                return next(new AppError("Contact is already deleted", 400));
            }

            const softDel = await prisma.contact.update({
                where: {
                    id
                },
                data: {
                    isDeleted: true
                }

            })

            // add updates to audiolog
            await prisma.auditLog.create({
                data: {
                    changeType: "DELETE",
                    contactID: id,
                    changes: {
                        old: { isDeleted: false },
                        new: { isDeleted: true }
                    },
                    timestamp: new Date()
                }
            });
            return res.status(200).json({ message: "Contact has been deleted." })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }

    public async transfer(req: Request, res: Response, next: NextFunction) {
        try {
            const { from_contact_id, to_contact_id, amount }: ITransfer = req.body
            const formContact: IContact | null = await prisma.contact.findUnique({
                where: { id: from_contact_id, isDeleted: false }
            })
            const toContact: IContact | null = await prisma.contact.findUnique({
                where: { id: to_contact_id, isDeleted: false }
            })

            if (!formContact || !toContact) return next(new AppError("One of the accounts does not exist", 404))
            // if (formContact.isDeleted || toContact.isDeleted) return next(new AppError("One of the accounts is already deleted", 400))
            if (formContact.balance < amount) return next(new AppError("Insufficient balance", 400))

            await prisma.$transaction([
                prisma.contact.update({ where: { id: from_contact_id }, data: { balance: { decrement: amount } } }),
                prisma.contact.update({ where: { id: to_contact_id }, data: { balance: { increment: amount } } })
            ])
            await prisma.auditLog.createMany(
                {
                    data: [
                        {
                            contactID: from_contact_id,
                            changeType: "UPDATE",
                            changes: {
                                old: { balance: formContact.balance },
                                new: { balance: formContact.balance.minus(amount) }
                            },
                            timestamp: new Date()
                        },
                        {
                            contactID: to_contact_id,
                            changeType: "UPDATE",
                            changes: {
                                old: { balance: toContact.balance },
                                new: { balance: toContact.balance.plus(amount) }
                            },
                            timestamp: new Date()

                        }]
                })
            return res.status(200).json({ message: "The balance has been transferred successfully" })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }

    public async auditLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const contact: IContact | null = await prisma.contact.findUnique({
                where: {
                    id
                }
            })
            if (!contact) return next(new AppError(`Contact not found`, 404))

            const logs = await prisma.auditLog.findMany({
                where: {
                    contactID: id
                }
            })

            if (logs.length === 0) {
                return next(new AppError("No audit logs found for this contact", 404));
            }

            return res.status(200).json({ message: "Done", length: logs.length, data: logs })

        } catch (err) {
            return next(new AppError(err.message, 500))
        }
    }
}

export default ContactsController




