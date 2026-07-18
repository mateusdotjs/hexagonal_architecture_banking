import { Account } from "src/domain/account/account";
import { IAccountRepository } from "src/domain/account/account.repository";
import { eq } from "drizzle-orm";
import { accountTable } from "../schema/account.schema";
import { AccountMapper } from "../mappers/account.mapper";
import { DrizzleDB } from "../drizzle";

export class DrizzleAccountRepository
    implements IAccountRepository {

    constructor(
        private readonly db: DrizzleDB,
    ) { }

    async save(account: Account): Promise<Account> {
        const [created] = await this.db.insert(accountTable).values(
            AccountMapper.toPersistence(account)
        ).returning();

        return AccountMapper.toDomain(created);
    }

    async update(account: Account): Promise<Account> {
        const [updated] = await this.db.update(accountTable).set(
            AccountMapper.toPersistence(account)
        ).returning()

        return AccountMapper.toDomain(updated);
    }

    async findById(id: string): Promise<Account | null> {
        const [row] = await this.db
            .select()
            .from(accountTable)
            .where(eq(accountTable.id, id));

        if (!row) {
            return null;
        }

        return AccountMapper.toDomain(row);
    }
}