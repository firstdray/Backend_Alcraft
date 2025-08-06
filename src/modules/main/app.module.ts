import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../users/users.module";
import {TShirtModule} from "../t-shirt/t-shirt.module";

@Module({
  imports: [
      ConfigModule.forRoot({
        load: [],
        isGlobal: true,
      }),
      UsersModule,
      TShirtModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
