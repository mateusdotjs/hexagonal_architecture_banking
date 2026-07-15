import { Account } from "./account"

export interface IAccountRepository {
    save(account: Account): Promise<void>
}