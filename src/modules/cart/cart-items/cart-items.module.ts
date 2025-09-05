import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {CartItems} from "./cart-items.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import process from "node:process";

const entities = [CartItems]

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
    ],
    controllers: [],
    providers: [],
})

export class CartItemsModule {}