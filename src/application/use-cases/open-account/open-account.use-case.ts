import { Account } from 'src/domain/account/account';
import { OpenAccountInput } from './open-account.input';
import { OpenAccountOutput } from './open-account.output';
import { IAccountRepository } from 'src/domain/account/account.repository';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

export class OpenAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(input: OpenAccountInput): Promise<OpenAccountOutput> {
    return this.unitOfWork.execute(async () => {
      const account = Account.open(input.ownerId);
      await this.accountRepository.save(account);
      return {
        accountId: account.id,
        ownerId: account.ownerId,
        balance: account.getBalance().toString(),
        status: account.getStatus(),
        createdAt: account.createdAt,
      };
    });
  }
}
