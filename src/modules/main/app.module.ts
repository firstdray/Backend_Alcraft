import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../users/users.module";
import {TShirtModule} from "../t-shirt/t-shirt.module";
import {OrdersModule} from "../orders/orders.module";
import {AuthModule} from "../auth/auth.module";
import {CartModule} from "../cart/cart.module";

@Module({
  imports: [
      ConfigModule.forRoot({
        load: [],
        isGlobal: true,
      }),
      AuthModule,
      UsersModule,
      TShirtModule,
      OrdersModule,
      CartModule,
  ]
})
export class AppModule {}
