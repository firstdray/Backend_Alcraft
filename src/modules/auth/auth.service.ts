import {Injectable, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {CheckAuthDTO} from "./DTO/check-auth.dto";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {HashedHelper} from "../common/helpers/hashed.helper";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly usersService: UsersService) {
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, ...userWithoutPass} = user;
            return userWithoutPass;

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
}