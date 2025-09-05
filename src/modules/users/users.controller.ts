import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger, NotFoundException,
    Param,
    Post,
    Put
} from "@nestjs/common";
import {UsersService} from "./users.service";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {UpdateUserDTO} from "./DTO/update-user.dto";
import {UserWithoutDTO} from "./DTO/user-without.dto";
import {SuccessResponse} from "../common/interface/api-response.interface";
import {ResponseHelper} from "../common/helpers/response.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {ErrorCodes} from "../common/enum/error-codes.enum";

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly usersService: UsersService) {}

    @Get('/get/:id')
    @HttpCode(HttpStatus.OK)
    async getUser(@Param('id') id: string): Promise<SuccessResponse<UserWithoutDTO>> {
        try {
            const foundUser = await this.usersService.getUserById(id);
            return ResponseHelper.found('User', foundUser, SuccessCodes.USER_FOUND)
        } catch (err) {
            this.logger.error('Failed to fetch User', err.stack);

            if (err.message === ErrorCodes.USER_NOT_FOUND) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND));
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<SuccessResponse<UserWithoutDTO>> {
        try {
            const user = await this.usersService.addNewUser(createUserDTO);
            return ResponseHelper.created('Users', user, SuccessCodes.USER_CREATED);
        }catch(error) {
            this.logger.error('Failed to add user', error.stack);

            if (error.message === ErrorCodes.USER_ALREADY_EXISTS) {
                throw new ConflictException(ResponseHelper.alreadyExists('User', ErrorCodes.USER_ALREADY_EXISTS))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Put('/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDTO): Promise<SuccessResponse<UserWithoutDTO>> {
        try {
            const updateUser = await this.usersService.updateUser(id, updateData);
            return ResponseHelper.updated('User', updateUser, SuccessCodes.USER_UPDATED)
        } catch (error) {
            this.logger.error('Failed to update user', error.stack);

            if (error.message === ErrorCodes.USER_NOT_FOUND) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Delete('/delete/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string): Promise<SuccessResponse<null>> {
        this.logger.log(`Deleting User with ID: ${id}`)
        try {
            await this.usersService.deleteUser(id);
            return ResponseHelper.delete('User', null, SuccessCodes.USER_DELETED);
        } catch (error) {
            this.logger.error(`Failed to delete User`, error.stack);

            if (error.message === ErrorCodes.USER_NOT_FOUND) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }
}