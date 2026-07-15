import { Account } from "./account"

export interface IAccountRepository {
    save(account: Account): Promise<void>

    findById(id: string): Promise<Account | null>
}