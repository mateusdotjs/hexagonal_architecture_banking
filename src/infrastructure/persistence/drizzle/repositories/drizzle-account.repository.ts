import { Account } from "src/domain/account/account";
import { IAccountRepository } from "src/domain/account/account.repository";
import { eq } from "drizzle-orm";
import { accountTable } from "../schema/account.schema";
import { AccountMapper } from "../mappers/account.mapper";
import { DrizzleDB } from "../drizzle";
import { TransactionContext } from "../transaction-context";
import { BaseDrizzleRepository } from "./base-drizzle.repository";

export class DrizzleAccountRepository
    extends BaseDrizzleRepository
    implements IAccountRepository {

    constructor(
        db: DrizzleDB,
        transactionContext: TransactionContext,
    ) {
        super(db, transactionContext);
    }

    async save(account: Account): Promise<Account> {
        const [created] = await this.getConnection()
            .insert(accountTable)
            .values(
                AccountMapper.toPersistence(account),
            )
            .returning();

        return AccountMapper.toDomain(created);
    }

    async update(account: Account): Promise<Account> {
        const [updated] = await this.getConnection()
            .update(accountTable)
            .set(
                AccountMapper.toPersistence(account),
            )
            .where(eq(accountTable.id, account.id))
            .returning();

        return AccountMapper.toDomain(updated);
    }

    async findById(id: string): Promise<Account | null> {
        const [row] = await this.getConnection()
            .select()
            .from(accountTable)
            .where(eq(accountTable.id, id));

        if (!row) {
            return null;
        }

        return AccountMapper.toDomain(row);
    }
}