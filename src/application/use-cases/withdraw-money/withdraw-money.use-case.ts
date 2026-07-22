import { IAccountRepository } from 'src/domain/account/account.repository';
import { ITransactionRepository } from 'src/domain/transaction/transaction.repository';
import { WithdrawMoneyInput } from './withdraw-money.input';
import { WithdrawMoneyOutput } from './withdraw-money.output';
import { Money } from 'src/domain/shared/money.vo';
import { Transaction } from 'src/domain/transaction/transaction';
import { TransactionType } from 'src/domain/transaction/transaction.type';
import { randomUUID } from 'crypto';
import { IUnitOfWork } from 'src/application/ports/persistence/unit-of-work';

export class WithdrawMoneyUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(input: WithdrawMoneyInput): Promise<WithdrawMoneyOutput> {
    return this.unitOfWork.execute(async () => {
      const account = await this.accountRepository.findById(input.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const amount = Money.of(input.amount);
      account.withdraw(amount);

      const transaction = new Transaction(
        randomUUID(),
        account.id,
        amount,
        TransactionType.WITHDRAW,
        new Date(),
        undefined,
        'Withdraw',
      );

      await this.accountRepository.update(account);
      await this.transactionRepository.save(transaction);

      return {
        transactionId: transaction.id,
        accountId: account.id,
        balance: account.getBalance().toString(),
      };
    });
  }
}
