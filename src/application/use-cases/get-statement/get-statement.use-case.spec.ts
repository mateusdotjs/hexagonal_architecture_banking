import { GetStatementUseCase } from './get-statement.use-case';

import { Account } from 'src/domain/account/account';
import { Money } from 'src/domain/shared/money.vo';
import { Transaction } from 'src/domain/transaction/transaction';
import { TransactionType } from 'src/domain/transaction/transaction.type';
import { IAccountRepository } from 'src/domain/account/account.repository';
import { ITransactionRepository } from 'src/domain/transaction/transaction.repository';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

describe('GetStatementUseCase', () => {
  let accountRepository: IAccountRepository;
  let transactionRepository: ITransactionRepository;
  let unitOfWork: IUnitOfWork;
  let useCase: GetStatementUseCase;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    };

    transactionRepository = {
      save: jest.fn(),
      findByAccountId: jest.fn(),
    };

    unitOfWork = {
      execute: jest.fn(async (work) => work()),
    };

    useCase = new GetStatementUseCase(
      accountRepository,
      transactionRepository,
      unitOfWork,
    );
  });

  it('should return account statement', async () => {
    const account = Account.open('owner-123');
    account.deposit(Money.of('100'));

    const transaction = new Transaction(
      'transaction-123',
      account.id,
      Money.of('100'),
      TransactionType.DEPOSIT,
      new Date('2026-01-01'),
      undefined,
      'Deposit',
    );

    accountRepository.findById = jest.fn().mockResolvedValue(account);

    transactionRepository.findByAccountId = jest
      .fn()
      .mockResolvedValue([transaction]);

    const input = {
      accountId: account.id,
    };

    const output = await useCase.execute(input);

    expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

    expect(accountRepository.findById).toHaveBeenCalledWith(account.id);

    expect(transactionRepository.findByAccountId).toHaveBeenCalledWith(
      account.id,
    );

    expect(output.accountId).toBe(account.id);

    expect(output.balance).toBe('100');

    expect(output.transactions).toHaveLength(1);

    expect(output.transactions[0]).toEqual({
      id: transaction.id,
      amount: '100',
      type: TransactionType.DEPOSIT,
      createdAt: transaction.createdAt,
      relatedAccountId: undefined,
      description: 'Deposit',
    });
  });

  it('should throw when account does not exist', async () => {
    accountRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        accountId: 'invalid-id',
      }),
    ).rejects.toThrow('Account not found');

    expect(transactionRepository.findByAccountId).not.toHaveBeenCalled();
  });
});
