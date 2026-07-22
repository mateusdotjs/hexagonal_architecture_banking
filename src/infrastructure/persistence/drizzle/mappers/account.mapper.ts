import { Account } from 'src/domain/account/account';
import { Money } from 'src/domain/shared/money.vo';
import { AccountRecord, NewAccountRecord } from '../schema/account.schema';

export class AccountMapper {
  static toDomain(row: AccountRecord): Account {
    return new Account(
      row.id,
      row.ownerId,
      Money.of(row.balance),
      row.status,
      row.createdAt,
    );
  }

  static toPersistence(account: Account): NewAccountRecord {
    return {
      id: account.id,
      ownerId: account.ownerId,
      balance: account.getBalance().toString(),
      status: account.getStatus(),
      createdAt: account.createdAt,
    };
  }
}
