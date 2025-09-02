import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {RefreshTokenStrategies} from "./strategies/refresh-token.strategies";
import {AuthController} from "./auth.controller";

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
    ],
    providers: [AuthService, JwtStrategy, RefreshTokenStrategies],
    controllers: [AuthController],
    exports: [AuthService],
})

export class AuthModule {}