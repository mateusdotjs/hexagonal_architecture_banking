export interface GetStatementOutput {
    accountId: string;
    balance: string;
    transactions: {
        id: string;
        amount: string;
        type: string;
        createdAt: Date;
        relatedAccountId?: string;
        description?: string;
    }[];
}
