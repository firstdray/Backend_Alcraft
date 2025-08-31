import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '15m'}
        }),
        JwtModule.register({
            secret: process.env.JWT_REFRESH_SECRET,
            signOptions: {expiresIn: '60d'}
        }),
        UsersModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
})

export class AuthModule {}