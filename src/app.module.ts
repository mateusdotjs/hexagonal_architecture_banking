import { Module } from '@nestjs/common';
import { AccountModule } from './infrastructure/api/account/account.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AccountModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
