import { Money } from "../shared/money.vo";
import { TransactionType } from "./transaction.type";

export class Transaction {
    constructor(
        readonly id: string,
        readonly accountId: string,
        readonly amount: Money,
        readonly type: TransactionType,
        readonly createdAt: Date,
        readonly relatedAccountId?: string,
        readonly description?: string,
    ) { }
}