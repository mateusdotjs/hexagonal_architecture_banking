import { IAccountRepository } from "src/domain/account/account.repository";
import { ITransactionRepository } from "src/domain/transaction/transaction.repository";
import { TransferMoneyInput } from "./transfer-money.input";
import { TransferMoneyOutput } from "./transfer-money.output";
import { Money } from "src/domain/shared/money.vo";
import { Transaction } from "src/domain/transaction/transaction";
import { TransactionType } from "src/domain/transaction/transaction.type";
import { randomUUID } from "crypto";

export class TransferMoneyUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository,
        private readonly transactionRepository: ITransactionRepository
    ) {}

    async execute(input: TransferMoneyInput): Promise<TransferMoneyOutput> {
        const sourceAccount = await this.accountRepository.findById(input.sourceAccountId);
        const targetAccount = await this.accountRepository.findById(input.targetAccountId);

        if (!sourceAccount) {
            throw new Error("Source account not found");
        }
        if (!targetAccount) {
            throw new Error("Target account not found");
        }

        const amount = Money.of(input.amount);
        
        // Update domains
        sourceAccount.withdraw(amount);
        targetAccount.deposit(amount);

        // Transactions
        const transactionOut = new Transaction(
            randomUUID(),
            sourceAccount.id,
            amount,
            TransactionType.TRANSFER_OUT,
            new Date(),
            targetAccount.id,
            "Transfer to account " + targetAccount.id
        );

        const transactionIn = new Transaction(
            randomUUID(),
            targetAccount.id,
            amount,
            TransactionType.TRANSFER_IN,
            new Date(),
            sourceAccount.id,
            "Transfer from account " + sourceAccount.id
        );

        // Persist
        await this.accountRepository.update(sourceAccount);
        await this.accountRepository.update(targetAccount);
        await this.transactionRepository.save(transactionOut);
        await this.transactionRepository.save(transactionIn);

        return {
            transactionOutId: transactionOut.id,
            transactionInId: transactionIn.id,
            sourceBalance: sourceAccount.getBalance().toString()
        };
    }
}
