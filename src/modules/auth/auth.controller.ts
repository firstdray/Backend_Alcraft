import {
    Body,
    Controller, InternalServerErrorException,
    NotFoundException,
    Post,
    UnauthorizedException
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {CheckAuthDTO} from "./DTO/check-auth.dto";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {RefreshTokenDTO} from "./DTO/refresh-token.dto";
import {ResponseHelper} from "../common/helpers/response.helper";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async checkUser(@Body() checkData: CheckAuthDTO) {
        try {
            const result = await this.authService.login(checkData);

            return ResponseHelper.success(
                result.message,
                SuccessCodes.USER_LOGGED_IN,
                {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token,
                    user: result.user,
                }
            )
        } catch (error) {
            if (error.message === ErrorCodes.USER_NOT_FOUND) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND));
            }

            if (error.message === ErrorCodes.INVALID_PASSWORD) {
                throw new UnauthorizedException(ResponseHelper.invalidPassword('User', ErrorCodes.INVALID_PASSWORD));
            }

            throw new InternalServerErrorException(
                ResponseHelper.internalError()
            );
        }
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDTO) {
        return this.authService.refreshTokens(refreshTokenDto);
    }

    // @Post('logout')
    // @UseGuards(AuthGuard('jwt'))
    // async logout(@Body() body: {userId: string}) {
    //     return this.authService.logout(body.userId);
    // }
}