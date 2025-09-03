import {OrdersEntity} from "./orders.entity";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrdersController} from "./orders.controller";
import {OrdersService} from "./orders.service";

const entities = [OrdersEntity];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
                entities: entities,
            })
        }),
        TypeOrmModule.forFeature(entities),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [],
})

export class OrdersModule {}