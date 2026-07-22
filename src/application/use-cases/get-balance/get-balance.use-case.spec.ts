import { GetBalanceUseCase } from "./get-balance.use-case";

import { Account } from "src/domain/account/account";
import { Money } from "src/domain/shared/money.vo";
import { IAccountRepository } from "src/domain/account/account.repository";
import { IUnitOfWork } from "src/application/ports/persistence/unit-of-work";

describe("GetBalanceUseCase", () => {

    let accountRepository: IAccountRepository;
    let unitOfWork: IUnitOfWork;
    let useCase: GetBalanceUseCase;

    beforeEach(() => {

        accountRepository = {
            save: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
        };

        unitOfWork = {
            execute: jest.fn(async (work) => work()),
        };

        useCase = new GetBalanceUseCase(
            accountRepository,
            unitOfWork,
        );

    });

    it("should return account balance", async () => {

        const account = Account.open("owner-123");
        account.deposit(Money.of("250"));

        accountRepository.findById = jest.fn().mockResolvedValue(account);

        const input = {
            accountId: account.id,
        };

        const output = await useCase.execute(input);

        expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

        expect(accountRepository.findById)
            .toHaveBeenCalledWith(account.id);

        expect(output.accountId).toBe(account.id);

        expect(output.balance).toBe("250");

    });

    it("should throw when account does not exist", async () => {

        accountRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(

            useCase.execute({
                accountId: "invalid-id",
            }),

        ).rejects.toThrow("Account not found");

    });

});
