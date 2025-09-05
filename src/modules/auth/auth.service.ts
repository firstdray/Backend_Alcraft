import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {CheckAuthDTO} from "./DTO/check-auth.dto";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {HashedHelper} from "../common/helpers/hashed.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {JsonWebTokenError, JwtService, TokenExpiredError} from "@nestjs/jwt";
import * as process from "node:process";
import {RefreshTokenDTO} from "./DTO/refresh-token.dto";
import {SuccessResponse} from "../common/interface/api-response.interface";
import {ResponseHelper} from "../common/helpers/response.helper";
import {TokenPayloadDTO} from "./DTO/token-payload.dto";
import {UserJWT} from "../users/DTO/userJWTdto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    }

    public async login(checkData: CheckAuthDTO) {
        try {
            const user = await this.usersService.getUser(checkData.email, checkData.phone)

            if (!user) {
                this.logger.log('User not found');
                throw new NotFoundException({
                    message: 'User not found system',
                    code: ErrorCodes.USER_NOT_FOUND,
                });
            }

            const isPasswordValid = await HashedHelper.comparePassword(checkData.pass, user.pass)

            if (!isPasswordValid) {
                this.logger.warn('Invalid password');
                throw new Error(ErrorCodes.INVALID_PASSWORD)
            }

            const tokens = await this.generateTokens(user)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, email, phone, id: DBid, ...userPublic} = user;
            return {
                success: true,
                message: 'Login Success',
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                user: userPublic,
                code: SuccessCodes.USER_LOGGED_IN,
            };

        } catch (err) {
            if (err.message === ErrorCodes.USER_NOT_FOUND) {
                throw new Error(ErrorCodes.USER_NOT_FOUND)
            }

            if (err.message === ErrorCodes.INVALID_PASSWORD) {
                throw new Error(ErrorCodes.INVALID_PASSWORD);
            }

            throw new Error(ErrorCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async refreshTokens(refreshTokenDTO: RefreshTokenDTO): Promise<SuccessResponse<{
        access_token: string;
        refresh_token: string;
        user: UserJWT;
    }>> {
        try {
            const payload = this.jwtService.verify(refreshTokenDTO.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            });

            const user = await this.usersService.getUserByJWT(payload.userId);

            if (!user) {
                this.logger.warn(`User not found for refresh token: ${payload.userId}`);
                throw new UnauthorizedException(
                    ResponseHelper.error('User not found', ErrorCodes.USER_NOT_FOUND)
                );
            }

            const tokens = await this.generateTokens(user);

            return ResponseHelper.success(
                'Tokens refreshed successfully',
                SuccessCodes.TOKENS_REFRESHED,
                {
                    access_token: tokens.accessToken,
                    refresh_token: tokens.refreshToken,
                    user: user
                }
            );

        } catch (err) {
            this.logger.error('Refresh token failed', err.message);

            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException(
                    ResponseHelper.error('Refresh token expired', ErrorCodes.TOKEN_EXPIRED)
                );
            }

            if (err instanceof JsonWebTokenError) {
                throw new UnauthorizedException(
                    ResponseHelper.error('Invalid refresh token', ErrorCodes.INVALID_TOKEN)
                );
            }

            if (err instanceof UnauthorizedException) {
                throw err; // Пробрасываем уже созданные UnauthorizedException
            }

            throw new InternalServerErrorException(
                ResponseHelper.internalError()
            );
        }
    }

    // public async logout(userId: string) {
    //     return {
    //         success: true,
    //         message: 'Logout Success',
    //         code: SuccessCodes.USER_LOGOUT,
    //     }
    // }

    private async generateTokens(tokenPayload: TokenPayloadDTO) {
      const accessToken = this.jwtService.sign(
          {
              userId: tokenPayload.userId,
              email: tokenPayload.email,
              phone: tokenPayload.phone,
          },
          {
              secret: process.env.JWT_SECRET,
              expiresIn: '15m'
          }
      );

      const refreshToken = this.jwtService.sign(
          { userId: tokenPayload.userId },
          {
              secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
              expiresIn: '60d'
          }
      );

      return { accessToken, refreshToken }
    }
}