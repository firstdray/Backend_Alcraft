import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
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
        TypeOrmModule.forFeature(entities),
        CartModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule {}