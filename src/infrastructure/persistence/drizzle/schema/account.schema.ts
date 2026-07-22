import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { AccountStatus } from 'src/domain/account/account-status.type';

export const accountTable = pgTable('accounts', {
  id: uuid('id').primaryKey(),

  ownerId: uuid('owner_id').notNull(),

  balance: numeric('balance', {
    precision: 18,
    scale: 2,
  }).notNull(),

  status: varchar('status', {
    length: 10,
  })
    .$type<AccountStatus>()
    .notNull(),

  createdAt: timestamp('created_at').notNull(),
});

export type AccountRecord = InferSelectModel<typeof accountTable>;
export type NewAccountRecord = InferInsertModel<typeof accountTable>;
