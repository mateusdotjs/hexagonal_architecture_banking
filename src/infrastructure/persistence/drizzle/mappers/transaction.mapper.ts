import { Transaction } from "src/domain/transaction/transaction";
import { Money } from "src/domain/shared/money.vo";
import { TransactionRecord, NewTransactionRecord } from "../schema/transaction.schema";

export class TransactionMapper {

    static toDomain(row: TransactionRecord): Transaction {
        return new Transaction(
            row.id,
            row.accountId,
            Money.of(row.amount),
            row.type,
            row.createdAt,
            row.relatedAccountId ?? undefined,
            row.description ?? undefined
        );
    }

    static toPersistence(transaction: Transaction): NewTransactionRecord {
        return {
            id: transaction.id,
            accountId: transaction.accountId,
            amount: transaction.amount.toString(),
            type: transaction.type,
            createdAt: transaction.createdAt,
            relatedAccountId: transaction.relatedAccountId ?? null,
            description: transaction.description ?? null,
        };
    }
}
