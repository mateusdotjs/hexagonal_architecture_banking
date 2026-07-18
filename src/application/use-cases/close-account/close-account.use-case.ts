import { IAccountRepository } from "src/domain/account/account.repository";
import { CloseAccountInput } from "./close-account.input";
import { CloseAccountOutput } from "./close-account.output";

export class CloseAccountUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository
    ) {}

    async execute(input: CloseAccountInput): Promise<CloseAccountOutput> {
        const account = await this.accountRepository.findById(input.accountId);
        if (!account) {
            throw new Error("Account not found");
        }

        account.close();

        await this.accountRepository.update(account);

        return {
            accountId: account.id,
            status: account.getStatus()
        };
    }
}
