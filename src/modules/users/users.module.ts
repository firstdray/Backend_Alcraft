import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "node:process";
import {UsersEntity} from "./users.entity";

const entities = [UsersEntity];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
            entities: entities,
        })
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class UsersModule {}