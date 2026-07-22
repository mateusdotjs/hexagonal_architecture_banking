import { CloseAccountUseCase } from './close-account.use-case';

import { Account } from 'src/domain/account/account';
import { AccountStatus } from 'src/domain/account/account-status.type';
import { IAccountRepository } from 'src/domain/account/account.repository';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

describe('CloseAccountUseCase', () => {
  let accountRepository: IAccountRepository;
  let unitOfWork: IUnitOfWork;
  let useCase: CloseAccountUseCase;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    };

    unitOfWork = {
      execute: jest.fn(async (work) => work()),
    };

    useCase = new CloseAccountUseCase(accountRepository, unitOfWork);
  });

  it('should close an account with zero balance', async () => {
    const account = Account.open('owner-123');

    accountRepository.findById = jest.fn().mockResolvedValue(account);

    const input = {
      accountId: account.id,
    };

    const output = await useCase.execute(input);

    expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

    expect(accountRepository.findById).toHaveBeenCalledWith(account.id);

    expect(accountRepository.update).toHaveBeenCalledTimes(1);

    expect(output.accountId).toBe(account.id);

    expect(output.status).toBe(AccountStatus.CLOSED);
  });

  it('should throw when account does not exist', async () => {
    accountRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        accountId: 'invalid-id',
      }),
    ).rejects.toThrow('Account not found');

    expect(accountRepository.update).not.toHaveBeenCalled();
  });
});
