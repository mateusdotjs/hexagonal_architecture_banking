import { DepositMoneyUseCase } from './deposit-money.use-case';

import { Account } from 'src/domain/account/account';
import { IAccountRepository } from 'src/domain/account/account.repository';
import { ITransactionRepository } from 'src/domain/transaction/transaction.repository';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

describe('DepositMoneyUseCase', () => {
  let accountRepository: IAccountRepository;
  let transactionRepository: ITransactionRepository;
  let unitOfWork: IUnitOfWork;
  let useCase: DepositMoneyUseCase;

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

    useCase = new DepositMoneyUseCase(
      accountRepository,
      transactionRepository,
      unitOfWork,
    );
  });

  it('should deposit money', async () => {
    const account = Account.open('owner-123');

    accountRepository.findById = jest.fn().mockResolvedValue(account);

    const input = {
      accountId: account.id,
      amount: '100',
    };

    const output = await useCase.execute(input);

    expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

    expect(accountRepository.findById).toHaveBeenCalledWith(account.id);

    expect(accountRepository.update).toHaveBeenCalledTimes(1);

    expect(transactionRepository.save).toHaveBeenCalledTimes(1);

    expect(output.balance).toBe('100');
  });

  it('should throw when account does not exist', async () => {
    accountRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        accountId: 'invalid-id',
        amount: '100',
      }),
    ).rejects.toThrow('Account not found');

    expect(accountRepository.update).not.toHaveBeenCalled();

    expect(transactionRepository.save).not.toHaveBeenCalled();
  });
});
