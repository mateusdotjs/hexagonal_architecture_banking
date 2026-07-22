import { Transaction } from './transaction';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
}
