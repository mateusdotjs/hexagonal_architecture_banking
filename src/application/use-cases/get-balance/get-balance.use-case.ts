import { IAccountRepository } from "src/domain/account/account.repository";
import { GetBalanceInput } from "./get-balance.input";
import { GetBalanceOutput } from "./get-balance.output";

export class GetBalanceUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository
    ) {}

    async execute(input: GetBalanceInput): Promise<GetBalanceOutput> {
        const account = await this.accountRepository.findById(input.accountId);
        if (!account) {
            throw new Error("Account not found");
        }

        return {
            accountId: account.id,
            balance: account.getBalance().toString()
        };
    }
}
