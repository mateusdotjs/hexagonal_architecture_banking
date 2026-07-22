import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { TransactionType } from 'src/domain/transaction/transaction.type';

export const transactionTable = pgTable('transactions', {
  id: uuid('id').primaryKey(),

  accountId: uuid('account_id').notNull(),

  amount: numeric('amount', {
    precision: 18,
    scale: 2,
  }).notNull(),

  type: varchar('type', {
    length: 20,
  })
    .$type<TransactionType>()
    .notNull(),

  createdAt: timestamp('created_at').notNull(),

  relatedAccountId: uuid('related_account_id'),

  description: varchar('description', {
    length: 255,
  }),
});

export type TransactionRecord = InferSelectModel<typeof transactionTable>;
export type NewTransactionRecord = InferInsertModel<typeof transactionTable>;
