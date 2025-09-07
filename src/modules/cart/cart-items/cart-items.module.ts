import {Module} from "@nestjs/common";
import {CartItemsEntity} from "./cart-items.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CartItemsService} from "./cart-items.service";

const entities = [CartItemsEntity]

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
    ],
    controllers: [],
    providers: [CartItemsService],
    exports: [CartItemsService],
})

export class CartItemsModule {}