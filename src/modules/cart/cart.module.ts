import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as process from "node:process";
import {CartEntity} from "./cart.entity";
import {CartService} from "./cart.service";
import {CartItemsModule} from "./cart-items/cart-items.module";
import {CartController} from "./cart.controller";

const entities = [CartEntity]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: []
        }),
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
            entities: entities,
        }),
        TypeOrmModule.forFeature(entities),
        CartItemsModule,
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})

export class CartModule {}