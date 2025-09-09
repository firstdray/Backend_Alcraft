import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "node:process";
import {UsersEntity} from "./users.entity";
import {ConfigModule} from "@nestjs/config";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {CartModule} from "../cart/cart.module";

const entities = [UsersEntity];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [],
        }),
        // TypeOrmModule.forRoot({
        //     type: process.env.DB_TYPE as 'postgres',
        //     host: process.env.DB_HOST,
        //     port: Number(process.env.DB_PORT),
        //     username: process.env.DB_USER,
        //     password: process.env.DB_PASSWORD,
        //     database: process.env.DB_NAME,
        //     autoLoadEntities: true,
        //     synchronize: false,
        //     entities: entities,
        // }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false},
            autoLoadEntities: true,
            synchronize: false,
        }),
        TypeOrmModule.forFeature(entities),
        CartModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule {}