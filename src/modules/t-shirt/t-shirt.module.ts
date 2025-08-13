import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "node:process";
import {TShirtEntity} from "./t-shirt.entity";
import {ConfigModule} from "@nestjs/config";
import {TShirtController} from "./t-shirt.controller";
import {TShirtService} from "./t-shirt.service";

const entities = [TShirtEntity];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {rejectUnauthorized: false},
            autoLoadEntities: true,
            synchronize: true,
            entities: entities,
        }),
        TypeOrmModule.forFeature(entities),
    ],
    controllers: [TShirtController],
    providers: [TShirtService],
    exports: [],
})

export class TShirtModule {}