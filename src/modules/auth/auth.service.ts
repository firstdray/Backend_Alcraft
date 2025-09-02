import {Injectable, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {CheckAuthDTO} from "./DTO/check-auth.dto";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {HashedHelper} from "../common/helpers/hashed.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {JwtService} from "@nestjs/jwt";
import {UsersEntity} from "../users/users.entity";
import * as process from "node:process";
import {RefreshTokenDTO} from "./DTO/refresh-token.dto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    }

    public async login(checkData: CheckAuthDTO) {
        try {
            const user = await this.usersService.getUser({
                email: checkData.email,
                phone: checkData.phone,
            })

            if (!user) {
                this.logger.log('User not found');
                throw new NotFoundException({
                    message: 'User not found system',
                    code: ErrorCodes.USER_NOT_FOUND,
                });
            }

            const isPasswordValid = await HashedHelper.comparePassword(checkData.pass, user.pass)

            if (!isPasswordValid) {
                this.logger.log('Invalid password');
                throw new UnauthorizedException({
                    message: 'Invalid password',
                    code: ErrorCodes.INVALID_PASSWORD,
                })
            }

            const tokens = await this.generateTokens(user)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, ...userWithoutPass} = user;
            return {
                success: true,
                message: 'Login Success',
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                user: userWithoutPass,
                code: SuccessCodes.USER_LOGGED_IN,
            };

        } catch (err) {
            if (err instanceof NotFoundException) {
                return {
                    success: false,
                    message: 'User not found',
                    code: ErrorCodes.USER_NOT_FOUND,
                }
            }
            if (err instanceof UnauthorizedException) {
                return {
                    success: false,
                    message: 'Invalid password',
                    code: ErrorCodes.INVALID_PASSWORD,
                }
            }

            return {
                success: false,
                message: 'Something went wrong',
                code: ErrorCodes.INTERNAL_SERVER_ERROR,
            }
        }
    }

    public async refreshTokens(refreshTokenDTO: RefreshTokenDTO) {
        try {
            const payload = this.jwtService.verify(refreshTokenDTO.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            })

            const user = await this.usersService.getUserById(payload.userId)

            if (!user) {
                this.logger.log('User not found');
                throw new UnauthorizedException({
                    message: 'Invalid password',
                    code: ErrorCodes.INVALID_PASSWORD,
                })
            }

            const tokens = await this.generateTokens(user)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, ...userWithoutPass} = user

            return {
                success: true,
                message: 'Refresh token success',
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                user: userWithoutPass,
                code: SuccessCodes.TOKENS_REFRESHED
            }
        } catch (err) {
            this.logger.log('Refresh token failed');

            if (err instanceof UnauthorizedException) {
                return {
                    success: false,
                    message: 'Invalid password',
                    code: ErrorCodes.INVALID_PASSWORD,
                }
            }

            return {
                success: false,
                message: 'Something went wrong',
                code: ErrorCodes.INTERNAL_SERVER_ERROR,
            }
        }
    }

    // public async logout(userId: string) {
    //     return {
    //         success: true,
    //         message: 'Logout Success',
    //         code: SuccessCodes.USER_LOGOUT,
    //     }
    // }

    private async generateTokens(user: UsersEntity) {
        const payload = {
            userId: user.id,
            email: user.email,
            phone: user.phone,
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m'
        })

        const refreshToken = this.jwtService.sign(
            {userId: user.userId},
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '60d'
            }
        )

        return { accessToken, refreshToken }
    }
}