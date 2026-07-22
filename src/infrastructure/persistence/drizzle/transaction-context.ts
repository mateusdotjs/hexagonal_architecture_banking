import { AsyncLocalStorage } from 'async_hooks';
import { EmptyRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgAsyncTransaction } from 'drizzle-orm/pg-core';

export class TransactionContext {
  private readonly storage = new AsyncLocalStorage<
    PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>
  >();

  run<T>(
    transaction: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
    callback: () => Promise<T>,
  ): Promise<T> {
    return this.storage.run(transaction, callback);
  }

  getTransaction():
    PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations> | undefined {
    return this.storage.getStore();
  }
}
