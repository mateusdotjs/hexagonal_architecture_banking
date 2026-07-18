import { Module } from "@nestjs/common";
import { createDrizzle } from "./drizzle";
import { DRIZZLE_DATABASE_TOKEN } from "./drizzle.token";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: DRIZZLE_DATABASE_TOKEN,
            useFactory: (configService: ConfigService) => {
                return createDrizzle(
                    configService.getOrThrow<string>("DATABASE_URL"),
                );
            },
            inject: [ConfigService]
        }
    ],
    exports: [DRIZZLE_DATABASE_TOKEN]
})
export class DrizzleModule { }