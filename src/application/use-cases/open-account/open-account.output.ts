import { AccountStatus } from "src/domain/account/accountStatus.type"

export interface OpenAccountOutput {
    accountId: string
    ownerId: string
    balance: string
    status: AccountStatus
    createdAt: Date
}
    