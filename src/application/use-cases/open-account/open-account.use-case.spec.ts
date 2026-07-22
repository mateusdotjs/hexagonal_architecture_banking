import { OpenAccountUseCase } from './open-account.use-case';
import { IAccountRepository } from 'src/domain/account/account.repository';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

describe('OpenAccountUseCase', () => {
  let accountRepository: IAccountRepository;
  let unitOfWork: IUnitOfWork;
  let useCase: OpenAccountUseCase;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    };

    unitOfWork = {
      execute: jest.fn(async (work) => work()),
    };

    useCase = new OpenAccountUseCase(accountRepository, unitOfWork);
  });

  it('should open a new account', async () => {
    const input = {
      ownerId: 'owner-123',
    };

    const output = await useCase.execute(input);

    expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

    expect(accountRepository.save).toHaveBeenCalledTimes(1);

    expect(accountRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: input.ownerId,
      }),
    );

    expect(output.ownerId).toBe(input.ownerId);

    expect(output.balance).toBe('0');

    expect(output.accountId).toBeDefined();

    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
