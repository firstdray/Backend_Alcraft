import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {RefreshTokenPayload} from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategies extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: RefreshTokenPayload) {
        const refreshToken = req.headers['authorization']?.replace('Bearer ', '');
        return {
            userId: payload.userId,
            refreshToken
        };
    }
}