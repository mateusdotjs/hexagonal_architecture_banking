import { Transaction } from "src/domain/transaction/transaction";
import { ITransactionRepository } from "src/domain/transaction/transaction.repository";
import { eq } from "drizzle-orm";
import { transactionTable } from "../schema/transaction.schema";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { DrizzleDB } from "../drizzle";
import { TransactionContext } from "../transaction-context";

export class DrizzleTransactionRepository implements ITransactionRepository {

    constructor(
        private readonly db: DrizzleDB,
        private readonly transactionContext: TransactionContext,
    ) { }

    async save(transaction: Transaction): Promise<Transaction> {
        const [created] = await this.connection
            .insert(transactionTable)
            .values(
                TransactionMapper.toPersistence(transaction),
            )
            .returning();

        return TransactionMapper.toDomain(created);

    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        const rows = await this.connection
            .select()
            .from(transactionTable)
            .where(
                eq(
                    transactionTable.accountId,
                    accountId,
                ),
            );

        return rows.map(TransactionMapper.toDomain);
    }

    private get connection() {

        return (
            this.transactionContext.getTransaction()
            ?? this.db
        );

    }
}
