import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put} from "@nestjs/common";
import {UsersService} from "./users.service";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {UsersEntity} from "./users.entity";
import {UpdateUserDTO} from "./DTO/update-user.dto";

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getUser(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<{
        success: boolean;
        message: string;
        data: UsersEntity;
    }> {
        const user = await this.usersService.addNewUser(createUserDTO);

        return {
            success: true,
            message: 'User added successfully',
            data: user
        };
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDTO):Promise<UsersEntity> {
        return this.usersService.updateUser(id, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}