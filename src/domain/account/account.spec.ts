import { Account } from './account';
import { AccountStatus } from './account-status.type';
import { Money } from '../shared/money.vo';

describe('Account', () => {
  describe('open', () => {
    it('should create an open account with zero balance', () => {
      const account = Account.open('owner-123');

      expect(account.ownerId).toBe('owner-123');

      expect(account.id).toBeDefined();

      expect(account.getBalance().toString()).toBe('0');

      expect(account.getStatus()).toBe(AccountStatus.OPEN);

      expect(account.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('deposit', () => {
    it('should increase the balance', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('100'));

      expect(account.getBalance().toString()).toBe('100');
    });

    it('should throw when amount is zero', () => {
      const account = Account.open('owner-123');

      expect(() => account.deposit(Money.of('0'))).toThrow(
        'Amount must be greater than zero',
      );
    });

    it('should throw when account is not open', () => {
      const account = Account.open('owner-123');

      account.close();

      expect(() => account.deposit(Money.of('100'))).toThrow(
        'Account is not open',
      );
    });
  });

  describe('withdraw', () => {
    it('should decrease the balance', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('100'));

      account.withdraw(Money.of('30'));

      expect(account.getBalance().toString()).toBe('70');
    });

    it('should allow withdrawing the full balance', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('100'));

      account.withdraw(Money.of('100'));

      expect(account.getBalance().toString()).toBe('0');
    });

    it('should throw when balance is insufficient', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('50'));

      expect(() => account.withdraw(Money.of('100'))).toThrow(
        'Insufficient balance',
      );
    });

    it('should throw when amount is zero', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('100'));

      expect(() => account.withdraw(Money.of('0'))).toThrow(
        'Amount must be greater than zero',
      );
    });

    it('should throw when account is not open', () => {
      const account = Account.open('owner-123');

      account.close();

      expect(() => account.withdraw(Money.of('10'))).toThrow(
        'Account is not open',
      );
    });
  });

  describe('close', () => {
    it('should close an account with zero balance', () => {
      const account = Account.open('owner-123');

      account.close();

      expect(account.getStatus()).toBe(AccountStatus.CLOSED);
    });

    it('should throw when balance is not zero', () => {
      const account = Account.open('owner-123');

      account.deposit(Money.of('100'));

      expect(() => account.close()).toThrow(
        'Account balance must be zero to close',
      );
    });

    it('should throw when account is already closed', () => {
      const account = Account.open('owner-123');

      account.close();

      expect(() => account.close()).toThrow('Account is already closed');
    });
  });
});
