import { DrizzleDB } from "./drizzle";
import { TransactionContext } from "./transaction-context";

export class DrizzleUnitOfWork {
    constructor(
        private readonly db: DrizzleDB,
        private readonly transactionContext: TransactionContext,
    ) { }

    async execute<T>(
        work: () => Promise<T>
    ): Promise<T> {
        return this.db.transaction(async (tx) => {
            return this.transactionContext.run(
                tx, work
            )
        })
    }
}