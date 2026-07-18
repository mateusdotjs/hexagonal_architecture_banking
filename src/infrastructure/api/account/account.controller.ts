import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OpenAccountUseCase } from "src/application/use-cases/open-account/open-account.use-case";
import { DepositMoneyUseCase } from "src/application/use-cases/deposit-money/deposit-money.use-case";
import { WithdrawMoneyUseCase } from "src/application/use-cases/withdraw-money/withdraw-money.use-case";
import { TransferMoneyUseCase } from "src/application/use-cases/transfer-money/transfer-money.use-case";
import { GetBalanceUseCase } from "src/application/use-cases/get-balance/get-balance.use-case";
import { GetStatementUseCase } from "src/application/use-cases/get-statement/get-statement.use-case";
import { CloseAccountUseCase } from "src/application/use-cases/close-account/close-account.use-case";

import { CreateAccountDto } from "./dto/create-account.dto";
import { DepositDto } from "./dto/deposit.dto";
import { WithdrawDto } from "./dto/withdraw.dto";
import { TransferDto } from "./dto/transfer.dto";

@Controller('accounts')
export class AccountController {
    constructor(
        private readonly openAccountUseCase: OpenAccountUseCase,
        private readonly depositMoneyUseCase: DepositMoneyUseCase,
        private readonly withdrawMoneyUseCase: WithdrawMoneyUseCase,
        private readonly transferMoneyUseCase: TransferMoneyUseCase,
        private readonly getBalanceUseCase: GetBalanceUseCase,
        private readonly getStatementUseCase: GetStatementUseCase,
        private readonly closeAccountUseCase: CloseAccountUseCase
    ) {}

    @Post()
    async open(@Body() input: CreateAccountDto) {
        return await this.openAccountUseCase.execute(input);
    }

    @Post(':accountId/deposit')
    async deposit(@Param('accountId') accountId: string, @Body() input: DepositDto) {
        return await this.depositMoneyUseCase.execute({
            accountId,
            amount: input.amount
        });
    }

    @Post(':accountId/withdraw')
    async withdraw(@Param('accountId') accountId: string, @Body() input: WithdrawDto) {
        return await this.withdrawMoneyUseCase.execute({
            accountId,
            amount: input.amount
        });
    }

    @Post(':accountId/transfer')
    async transfer(@Param('accountId') sourceAccountId: string, @Body() input: TransferDto) {
        return await this.transferMoneyUseCase.execute({
            sourceAccountId,
            targetAccountId: input.targetAccountId,
            amount: input.amount
        });
    }

    @Get(':accountId/balance')
    async getBalance(@Param('accountId') accountId: string) {
        return await this.getBalanceUseCase.execute({ accountId });
    }

    @Get(':accountId/statement')
    async getStatement(@Param('accountId') accountId: string) {
        return await this.getStatementUseCase.execute({ accountId });
    }

    @Post(':accountId/close')
    async closeAccount(@Param('accountId') accountId: string) {
        return await this.closeAccountUseCase.execute({ accountId });
    }
}