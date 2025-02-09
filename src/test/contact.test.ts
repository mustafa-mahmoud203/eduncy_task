
import { prismaMock } from '../../singleton.js';
import ContactsController from '../controllers/contact.js';
import { Request, Response, NextFunction } from 'express';
import { Contact, Prisma } from "@prisma/client";
import { mockDeep } from 'jest-mock-extended';

describe('Test Contacts', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const fromContact = mockDeep<Contact>({
        id: '123',
        balance: new Prisma.Decimal(100),
        isDeleted: false,
    });

    const toContact = mockDeep<Contact>({
        id: '456',
        balance: new Prisma.Decimal(50),
        isDeleted: false,
    });
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        req = {};
        res = { status: statusMock };
        next = jest.fn();
    });

    describe("transfer", () => {
        it('should transfer balance correctly', async () => {

            req.body = { from_contact_id: '123', to_contact_id: '456', amount: new Prisma.Decimal(30), };

            prismaMock.contact.findUnique
                .mockResolvedValueOnce(fromContact)
                .mockResolvedValueOnce(toContact);

            prismaMock.$transaction.mockResolvedValueOnce([
                { ...fromContact, balance: 70 },
                { ...toContact, balance: 80 },]);

            prismaMock.auditLog.createMany.mockResolvedValueOnce({ count: 2 })
            await new ContactsController().transfer(req as Request, res as Response, next);

            expect(prismaMock.contact.findUnique).toHaveBeenCalledTimes(2);
            expect(prismaMock.contact.findUnique).toHaveBeenCalledWith({ where: { id: '123', isDeleted: false }, });
            expect(prismaMock.contact.findUnique).toHaveBeenCalledWith({ where: { id: '456', isDeleted: false }, });

            expect(prismaMock.$transaction).toHaveBeenCalledWith([
                prismaMock.contact.update({ where: { id: '123' }, data: { balance: { decrement: 30 } }, }),
                prismaMock.contact.update({ where: { id: '456' }, data: { balance: { increment: 30 } }, })
            ]);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'The balance has been transferred successfully', });
        });

        it('should return error if One of the accounts does not exist', async () => {
            req.body = { from_contact_id: '123', to_contact_id: null, amount: 30, };

            prismaMock.contact.findUnique.mockResolvedValueOnce(fromContact).mockResolvedValueOnce(null);

            await new ContactsController().transfer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(new Error('One of the accounts does not exist'));
        });


        it('should return error if balance is insufficient', async () => {
            req.body = { from_contact_id: '123', to_contact_id: '456', amount: 200 };


            prismaMock.contact.findUnique
                .mockResolvedValueOnce(fromContact)
                .mockResolvedValueOnce(toContact);

            await new ContactsController().transfer(req as Request, res as Response, next);
            expect(parseFloat(fromContact.balance.toString())).toBeLessThan(req.body.amount);
        });

    })

    describe("soft delet", () => {
        it('should not return soft-deleted contacts in default listing', async () => {
            req.query = {};
            prismaMock.contact.findMany.mockResolvedValue([
                {
                    id: '123',
                    first_name: 'mustafa',
                    last_name: 'mahmoud',
                    email: 'mustafa@example.com',
                    company: 'eduncy',
                    balance: new Prisma.Decimal(20000),
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '456',
                    first_name: 'mohamed',
                    last_name: 'mahmoud',
                    email: 'mohamed@example.com',
                    company: 'eduncy',
                    balance: new Prisma.Decimal(10000),
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                ,]);
            await new ContactsController().contacts(req as Request, res as Response, next);
            expect(prismaMock.contact.findMany).toHaveBeenCalledWith({ where: { isDeleted: false, company: undefined, createdAt: undefined }, });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Done', length: 2, data: expect.any(Array), });
        });
    })

    describe("audit logs", () => {
        it('should log changes in audit logs when balance is transferred', async () => {
            req.body = { from_contact_id: '123', to_contact_id: '456', amount: new Prisma.Decimal(30), };

            prismaMock.contact.findUnique.mockResolvedValueOnce(fromContact).mockResolvedValueOnce(toContact);
            prismaMock.$transaction.mockResolvedValue([{}, {}]);
            prismaMock.auditLog.createMany.mockResolvedValue({ count: 2 });
            await new ContactsController().transfer(req as Request, res as Response, next);
            expect(prismaMock.auditLog.createMany)
                .toHaveBeenCalledWith({
                    data: [{
                        contactID: '123',
                        changeType: 'UPDATE',
                        changes: {
                            old: { balance: fromContact.balance },
                            new: { balance: fromContact.balance.minus(new Prisma.Decimal(30)) },
                        },
                        timestamp: expect.any(Date),
                    }, { contactID: '456', changeType: 'UPDATE', changes: { old: { balance: toContact.balance }, new: { balance: toContact.balance.plus(new Prisma.Decimal(30)) }, }, timestamp: expect.any(Date), },],
                });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'The balance has been transferred successfully' });
        });
    })

});



