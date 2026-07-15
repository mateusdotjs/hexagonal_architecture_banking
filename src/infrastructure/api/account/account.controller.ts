import { Body, Controller, Post } from "@nestjs/common";
import { OpenAccountUseCase } from "src/application/use-cases/open-account/open-account.use-case";
import { CreateAccountDto } from "./dto/create-account.dto";

@Controller('accounts')
export class AccountController {
    constructor(private readonly openAccountUseCase: OpenAccountUseCase) {}

@Post()
    async open(@Body() input: CreateAccountDto){
        return await this.openAccountUseCase.execute(input)
    }
}