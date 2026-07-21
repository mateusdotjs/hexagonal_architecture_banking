import { DrizzleDB } from "../drizzle";
import { TransactionContext } from "../transaction-context";

export abstract class BaseDrizzleRepository {
    constructor(
        protected readonly db: DrizzleDB,
        protected readonly transactionContext: TransactionContext,
    ) { }

    protected getConnection() {
        return this.transactionContext.getTransaction() ?? this.db;
    }
}