import { Account } from './account';

export interface IAccountRepository {
  save(account: Account): Promise<Account>;

  update(account: Account): Promise<Account>;

  findById(id: string): Promise<Account | null>;
}
