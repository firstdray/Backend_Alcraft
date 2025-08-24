import {IsOptional, IsString} from "class-validator";

export class CreateUserDTO {
    @IsString()
    userId: string;

    @IsString()
    pass: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsOptional()
    @IsString()
    patronymic: string;

    @IsString()
    phone: string;

    @IsString()
    email: string;
}