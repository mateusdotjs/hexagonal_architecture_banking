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

@Module({
    imports: [DrizzleModule],
    controllers: [AccountController],
    providers: [
        {
            provide: OpenAccountUseCase,
            useFactory: (accountRepository: IAccountRepository) => new OpenAccountUseCase(accountRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN]
        },
        {
            provide: DepositMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository) => new DepositMoneyUseCase(accountRepository, transactionRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN]
        },
        {
            provide: WithdrawMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository) => new WithdrawMoneyUseCase(accountRepository, transactionRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN]
        },
        {
            provide: TransferMoneyUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository) => new TransferMoneyUseCase(accountRepository, transactionRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN]
        },
        {
            provide: GetBalanceUseCase,
            useFactory: (accountRepository: IAccountRepository) => new GetBalanceUseCase(accountRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN]
        },
        {
            provide: GetStatementUseCase,
            useFactory: (accountRepository: IAccountRepository, transactionRepository: ITransactionRepository) => new GetStatementUseCase(accountRepository, transactionRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN, TRANSACTION_REPOSITORY_TOKEN]
        },
        {
            provide: CloseAccountUseCase,
            useFactory: (accountRepository: IAccountRepository) => new CloseAccountUseCase(accountRepository),
            inject: [ACCOUNT_REPOSITORY_TOKEN]
        },
        {
            provide: ACCOUNT_REPOSITORY_TOKEN,
            useFactory: (db: DrizzleDB) => new DrizzleAccountRepository(db),
            inject: [DRIZZLE_DATABASE_TOKEN]
        },
        {
            provide: TRANSACTION_REPOSITORY_TOKEN,
            useFactory: (db: DrizzleDB) => new DrizzleTransactionRepository(db),
            inject: [DRIZZLE_DATABASE_TOKEN]
        }
    ],
})
export class AccountModule { }