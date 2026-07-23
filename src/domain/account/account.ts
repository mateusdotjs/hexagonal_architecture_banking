import { randomUUID } from 'crypto';
import { Money } from '../shared/money.vo';
import { AccountStatus } from './account-status.type';

export class Account {
  readonly id: string;
  readonly ownerId: string;
  private balance: Money;
  private status: AccountStatus;
  readonly createdAt: Date;

  constructor(
    id: string,
    ownerId: string,
    balance: Money,
    status: AccountStatus,
    createdAt: Date,
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.balance = balance;
    this.status = status;
    this.createdAt = createdAt;
  }

  static open(ownerId: string): Account {
    return new Account(
      randomUUID(),
      ownerId,
      Money.of('0'),
      AccountStatus.OPEN,
      new Date(),
    );
  }

  deposit(amount: Money) {
    this.ensureAccountIsOpen();

    if (amount.isNegative()) {
      throw new Error('Amount must be positive');
    }

    if (amount.isZero()) {
      throw new Error('Amount must be greater than zero');
    }

    this.balance = this.balance.add(amount);
  }

  withdraw(amount: Money) {
    this.ensureAccountIsOpen();

    if (amount.isZero()) {
      throw new Error('Amount must be greater than zero');
    }

    if (amount.isGreaterThan(this.balance)) {
      throw new Error('Insufficient balance');
    }

    this.balance = this.balance.subtract(amount);
  }

  getBalance(): Money {
    return this.balance;
  }

  private ensureAccountIsOpen() {
    if (this.status !== AccountStatus.OPEN) {
      throw new Error('Account is not open');
    }
  }

  getStatus(): AccountStatus {
    return this.status;
  }

  close() {
    if (this.status === AccountStatus.CLOSED) {
      throw new Error('Account is already closed');
    }
    if (!this.balance.isZero()) {
      throw new Error('Account balance must be zero to close');
    }
    this.status = AccountStatus.CLOSED;
  }
}
