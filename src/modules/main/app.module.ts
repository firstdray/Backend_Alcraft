import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../users/users.module";
import {TShirtModule} from "../t-shirt/t-shirt.module";
import {OrdersModule} from "../orders/orders.module";
import {AuthModule} from "../auth/auth.module";
import {CartModule} from "../cart/cart.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import process from "node:process";

@Module({
  imports: [
      ConfigModule.forRoot({
        load: [],
        isGlobal: true,
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false},
          autoLoadEntities: true,
          synchronize: false,
      }),
      AuthModule,
      UsersModule,
      TShirtModule,
      OrdersModule,
      CartModule,
  ]
})
export class AppModule {}
