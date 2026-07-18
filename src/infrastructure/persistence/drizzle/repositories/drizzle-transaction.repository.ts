import { Transaction } from "src/domain/transaction/transaction";
import { ITransactionRepository } from "src/domain/transaction/transaction.repository";
import { eq } from "drizzle-orm";
import { transactionTable } from "../schema/transaction.schema";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { DrizzleDB } from "../drizzle";

export class DrizzleTransactionRepository implements ITransactionRepository {

    constructor(
        private readonly db: DrizzleDB,
    ) { }

    async save(transaction: Transaction): Promise<Transaction> {
        const [created] = await this.db.insert(transactionTable).values(
            TransactionMapper.toPersistence(transaction)
        ).returning();

        return TransactionMapper.toDomain(created);
    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        const rows = await this.db
            .select()
            .from(transactionTable)
            .where(eq(transactionTable.accountId, accountId));

        return rows.map(TransactionMapper.toDomain);
    }
}
