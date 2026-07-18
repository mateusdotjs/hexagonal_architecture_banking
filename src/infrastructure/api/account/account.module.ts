import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { OpenAccountUseCase } from "src/application/use-cases/open-account/open-account.use-case";
import { IAccountRepository } from "src/domain/account/account.repository";
import { ACCOUNT_REPOSITORY_TOKEN } from "src/domain/account/account.repository.token";
import { DrizzleAccountRepository } from "src/infrastructure/persistence/drizzle/repositories/drizzle-account.repository";
import { DrizzleDB } from "src/infrastructure/persistence/drizzle/drizzle";
import { DRIZZLE_DATABASE_TOKEN } from "src/infrastructure/persistence/drizzle/drizzle.token";
import { DrizzleModule } from "src/infrastructure/persistence/drizzle/drizzle.module";

@Module({
    imports: [DrizzleModule],
    controllers: [AccountController],
    providers: [{
        provide: OpenAccountUseCase,
        useFactory: (repository: IAccountRepository) => {
            return new OpenAccountUseCase(repository)
        },
        inject: [ACCOUNT_REPOSITORY_TOKEN]
    },
    {
        provide: ACCOUNT_REPOSITORY_TOKEN,
        useFactory: (db: DrizzleDB) => {
            return new DrizzleAccountRepository(db);
        },
        inject: [DRIZZLE_DATABASE_TOKEN]
    }],
})
export class AccountModule { }