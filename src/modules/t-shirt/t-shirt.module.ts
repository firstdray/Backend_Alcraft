import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
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
        TypeOrmModule.forFeature(entities),
    ],
    controllers: [TShirtController],
    providers: [TShirtService],
    exports: [],
})

export class TShirtModule {}