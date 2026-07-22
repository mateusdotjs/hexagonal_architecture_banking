import { TransferMoneyUseCase } from "./transfer-money.use-case";

import { Account } from "src/domain/account/account";
import { Money } from "src/domain/shared/money.vo";
import { IAccountRepository } from "src/domain/account/account.repository";
import { ITransactionRepository } from "src/domain/transaction/transaction.repository";
import { IUnitOfWork } from "src/application/ports/persistence/unit-of-work";

describe("TransferMoneyUseCase", () => {

    let accountRepository: IAccountRepository;
    let transactionRepository: ITransactionRepository;
    let unitOfWork: IUnitOfWork;
    let useCase: TransferMoneyUseCase;

    beforeEach(() => {

        accountRepository = {
            save: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
        };

        transactionRepository = {
            save: jest.fn(),
            findByAccountId: jest.fn(),
        };

        unitOfWork = {
            execute: jest.fn(async (work) => work()),
        };

        useCase = new TransferMoneyUseCase(
            accountRepository,
            transactionRepository,
            unitOfWork,
        );

    });

    it("should transfer money between accounts", async () => {

        const sourceAccount = Account.open("owner-source");
        sourceAccount.deposit(Money.of("100"));

        const targetAccount = Account.open("owner-target");

        accountRepository.findById = jest.fn()
            .mockResolvedValueOnce(sourceAccount)
            .mockResolvedValueOnce(targetAccount);

        const input = {
            sourceAccountId: sourceAccount.id,
            targetAccountId: targetAccount.id,
            amount: "100",
        };

        const output = await useCase.execute(input);

        expect(unitOfWork.execute).toHaveBeenCalledTimes(1);

        expect(accountRepository.findById)
            .toHaveBeenCalledWith(sourceAccount.id);

        expect(accountRepository.findById)
            .toHaveBeenCalledWith(targetAccount.id);

        expect(accountRepository.update)
            .toHaveBeenCalledTimes(2);

        expect(transactionRepository.save)
            .toHaveBeenCalledTimes(2);

        expect(output.sourceBalance).toBe("0");

        expect(output.transactionOutId).toBeDefined();

        expect(output.transactionInId).toBeDefined();

    });

    it("should throw when source account does not exist", async () => {

        const targetAccount = Account.open("owner-target");

        accountRepository.findById = jest.fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(targetAccount);

        await expect(

            useCase.execute({
                sourceAccountId: "invalid-id",
                targetAccountId: targetAccount.id,
                amount: "100",
            }),

        ).rejects.toThrow("Source account not found");

        expect(accountRepository.update)
            .not.toHaveBeenCalled();

        expect(transactionRepository.save)
            .not.toHaveBeenCalled();

    });

    it("should throw when target account does not exist", async () => {

        const sourceAccount = Account.open("owner-source");
        sourceAccount.deposit(Money.of("100"));

        accountRepository.findById = jest.fn()
            .mockResolvedValueOnce(sourceAccount)
            .mockResolvedValueOnce(null);

        await expect(

            useCase.execute({
                sourceAccountId: sourceAccount.id,
                targetAccountId: "invalid-id",
                amount: "100",
            }),

        ).rejects.toThrow("Target account not found");

        expect(accountRepository.update)
            .not.toHaveBeenCalled();

        expect(transactionRepository.save)
            .not.toHaveBeenCalled();

    });

});
