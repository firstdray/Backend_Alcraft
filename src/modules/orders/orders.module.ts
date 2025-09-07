import {OrdersEntity} from "./orders.entity";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrdersController} from "./orders.controller";
import {OrdersService} from "./orders.service";
import {CartModule} from "../cart/cart.module";
import {CartItemsModule} from "../cart/cart-items/cart-items.module";

const entities = [OrdersEntity];

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        CartModule,
        CartItemsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [],
})

export class OrdersModule {}