import { Account } from "src/domain/account/account";
import { IAccountRepository } from "src/domain/account/account.repository";

export class InMemoryAccountRepository implements IAccountRepository {
    private readonly accounts: Account[] = []

    async save(account: Account): Promise<void> {
        const index = this.accounts.findIndex(a => a.id === account.id);

        if (index >= 0) {
            this.accounts[index] = account;
            return;
        }

        this.accounts.push(account);
    }

    async findById(id: string): Promise<Account | null> {
        return this.accounts.find(a => a.id === id) ?? null;
    }
}