import { Decimal } from "@prisma/client/runtime/library";

interface ITransfer {
    from_contact_id: string
    to_contact_id: string
    amount: Decimal
}
export default ITransfer