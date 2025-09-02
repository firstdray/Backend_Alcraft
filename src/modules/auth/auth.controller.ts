import {
    Body,
    Controller, Get,
    NotFoundException,
    Post, Req,
    UnauthorizedException, UseGuards
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {CheckAuthDTO} from "./DTO/check-auth.dto";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {RefreshTokenDTO} from "./DTO/refresh-token.dto";
import {AuthGuard} from "@nestjs/passport";
import {CreateUserDTO} from "../users/DTO/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async checkUser(@Body() checkData: CheckAuthDTO) {
        try {
            const user = await this.authService.login(checkData);

            return {
                success: true,
                message: 'Login successfully',
                data: user,
                code: SuccessCodes.USER_LOGGED_IN
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {
                    success: false,
                    message: 'User not found system',
                    code: ErrorCodes.USER_NOT_FOUND,
                }
            }
            if (error instanceof UnauthorizedException) {
                return {
                    success: false,
                    message: 'Invalid password',
                    code: ErrorCodes.INVALID_PASSWORD,
                }
            }

            return {
                success: false,
                message: 'Something went wrong',
                code: ErrorCodes.INTERNAL_SERVER_ERROR
            };
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