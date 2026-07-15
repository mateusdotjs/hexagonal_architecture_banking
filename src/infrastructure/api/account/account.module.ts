import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { OpenAccountUseCase } from "src/application/use-cases/open-account/open-account.use-case";
import { IAccountRepository } from "src/domain/account/account.repository";
import { ACCOUNT_REPOSITORY_TOKEN } from "src/domain/account/account.repository.token";
import { InMemoryAccountRepository } from "src/infrastructure/persistence/in-memory/in-memory-account.repository";

@Module({
    imports: [],
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
        useClass: InMemoryAccountRepository,
    }],
})
export class AccountModule { }