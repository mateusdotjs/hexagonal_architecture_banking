import { IAccountRepository } from 'src/domain/account/account.repository';
import { ITransactionRepository } from 'src/domain/transaction/transaction.repository';
import { GetStatementInput } from './get-statement.input';
import { GetStatementOutput } from './get-statement.output';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

export class GetStatementUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(input: GetStatementInput): Promise<GetStatementOutput> {
    return this.unitOfWork.execute(async () => {
      const account = await this.accountRepository.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const transactions = await this.transactionRepository.findByAccountId(
        account.id,
      );

      return {
        accountId: account.id,
        balance: account.getBalance().toString(),
        transactions: transactions.map((t) => ({
          id: t.id,
          amount: t.amount.toString(),
          type: t.type,
          createdAt: t.createdAt,
          relatedAccountId: t.relatedAccountId,
          description: t.description,
        })),
      };
    });
  }
}
