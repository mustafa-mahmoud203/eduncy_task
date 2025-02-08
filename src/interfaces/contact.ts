import { Decimal } from "@prisma/client/runtime/library";

interface IContact {
    first_name: string
    last_name: string
    email: string
    company: string
    balance?: Decimal
    isDeleted?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export default IContact