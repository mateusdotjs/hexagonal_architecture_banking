import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { OpenAccountUseCase } from "src/application/use-cases/open-account/open-account.use-case";
import { DepositMoneyUseCase } from "src/application/use-cases/deposit-money/deposit-money.use-case";
import { WithdrawMoneyUseCase } from "src/application/use-cases/withdraw-money/withdraw-money.use-case";
import { TransferMoneyUseCase } from "src/application/use-cases/transfer-money/transfer-money.use-case";
import { GetBalanceUseCase } from "src/application/use-cases/get-balance/get-balance.use-case";
import { GetStatementUseCase } from "src/application/use-cases/get-statement/get-statement.use-case";
import { CloseAccountUseCase } from "src/application/use-cases/close-account/close-account.use-case";

import { IAccountRepository } from "src/domain/account/account.repository";
import { ACCOUNT_REPOSITORY_TOKEN } from "src/domain/account/account.repository.token";
import { DrizzleAccountRepository } from "src/infrastructure/persistence/drizzle/repositories/drizzle-account.repository";

import { ITransactionRepository } from "src/domain/transaction/transaction.repository";
import { TRANSACTION_REPOSITORY_TOKEN } from "src/domain/transaction/transaction.repository.token";
import { DrizzleTransactionRepository } from "src/infrastructure/persistence/drizzle/repositories/drizzle-transaction.repository";

import { DrizzleDB } from "src/infrastructure/persistence/drizzle/drizzle";
import { DRIZZLE_DATABASE_TOKEN } from "src/infrastructure/persistence/drizzle/drizzle.token";
import { DrizzleModule } from "src/infrastructure/persistence/drizzle/drizzle.module";
import { TransactionContext } from "src/infrastructure/persistence/drizzle/transaction-context";
import { IUnitOfWork } from "src/application/ports/persistence/unit-of-work";
import { UNIT_OF_WORK_TOKEN } from "src/application/ports/persistence/unit-of-work.token";

@Module({
    imports: [DrizzleModule],
    controllers: [AccountController],
    providers: [
        {
            provide: OpenAccountUseCase,
            useFactory: (accountRepository: IAccountRepository, unitOfWork: IUnitOfWork) => new OpenAccountUseCase(accountRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: DepositMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository, unitOfWork: IUnitOfWork) => new DepositMoneyUseCase(accountRepository, transactionRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: WithdrawMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository, unitOfWork: IUnitOfWork) => new WithdrawMoneyUseCase(accountRepository, transactionRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: TransferMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository, unitOfWork: IUnitOfWork) => new TransferMoneyUseCase(accountRepository, transactionRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: GetBalanceUseCase,
            useFactory: (accountRepository: IAccountRepository, unitOfWork: IUnitOfWork) => new GetBalanceUseCase(accountRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: GetStatementUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository, unitOfWork: IUnitOfWork) => new GetStatementUseCase(accountRepository, transactionRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: CloseAccountUseCase,
            useFactory: (accountRepository: IAccountRepository, unitOfWork: IUnitOfWork) => new CloseAccountUseCase(accountRepository, unitOfWork),
            inject: [ACCOUNT_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN]
        },
        {
            provide: ACCOUNT_REPOSITORY_TOKEN,
            useFactory: (db: DrizzleDB, transactionContext: TransactionContext) => new DrizzleAccountRepository(db, transactionContext),
            inject: [DRIZZLE_DATABASE_TOKEN, TransactionContext]
        },
        {
            provide: TRANSACTION_REPOSITORY_TOKEN,
            useFactory: (db: DrizzleDB, transactionContext: TransactionContext) => new DrizzleTransactionRepository(db, transactionContext),
            inject: [DRIZZLE_DATABASE_TOKEN, TransactionContext]
        }
    ],
})
export class AccountModule { }