import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TShirtEntity} from "./t-shirt.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TShirtController} from "./t-shirt.controller";
import {TShirtService} from "./t-shirt.service";

const entities = [TShirtEntity];

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
                ssl: {rejectUnauthorized: false},
                autoLoadEntities: true,
                synchronize: true,
                entities: entities,
            }),
        }),
        TypeOrmModule.forFeature(entities),
    ],
    controllers: [TShirtController],
    providers: [TShirtService],
    exports: [],
})

export class TShirtModule {}