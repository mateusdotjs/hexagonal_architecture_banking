import { Module } from '@nestjs/common';
import { createDrizzle, DrizzleDB } from './drizzle';
import { DRIZZLE_DATABASE_TOKEN } from './drizzle.token';
import { ConfigService } from '@nestjs/config';
import { DrizzleUnitOfWork } from './drizzle-unit-of-work';
import { TransactionContext } from './transaction-context';
import { UNIT_OF_WORK_TOKEN } from 'src/application/ports/persistence/unit-of-work.token';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UNIT_OF_WORK_TOKEN,
      useFactory: (db: DrizzleDB, transactionContext: TransactionContext) =>
        new DrizzleUnitOfWork(db, transactionContext),
      inject: [DRIZZLE_DATABASE_TOKEN, TransactionContext],
    },
    {
      provide: DRIZZLE_DATABASE_TOKEN,
      useFactory: (configService: ConfigService) => {
        return createDrizzle(configService.getOrThrow<string>('DATABASE_URL'));
      },
      inject: [ConfigService],
    },
    {
      provide: TransactionContext,
      useClass: TransactionContext,
    },
  ],
  exports: [DRIZZLE_DATABASE_TOKEN, UNIT_OF_WORK_TOKEN, TransactionContext],
})
export class DrizzleModule {}
