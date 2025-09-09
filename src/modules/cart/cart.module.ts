import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
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
        TypeOrmModule.forFeature(entities),
        CartItemsModule,
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})

export class CartModule {}