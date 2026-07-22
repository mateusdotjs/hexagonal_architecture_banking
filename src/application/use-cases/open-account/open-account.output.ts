import { AccountStatus } from 'src/domain/account/account-status.type';

export interface OpenAccountOutput {
  accountId: string;
  ownerId: string;
  balance: string;
  status: AccountStatus;
  createdAt: Date;
}
