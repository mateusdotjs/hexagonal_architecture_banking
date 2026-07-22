import { IAccountRepository } from 'src/domain/account/account.repository';
import { GetBalanceInput } from './get-balance.input';
import { GetBalanceOutput } from './get-balance.output';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

export class GetBalanceUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(input: GetBalanceInput): Promise<GetBalanceOutput> {
    return this.unitOfWork.execute(async () => {
      const account = await this.accountRepository.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      return {
        accountId: account.id,
        balance: account.getBalance().toString(),
      };
    });
  }
}
