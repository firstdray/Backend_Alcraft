import {IsOptional, IsString} from "class-validator";

export class CreateUserDTO {
    @IsString()
    userId: string;

    @IsString()
    pass: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    surname: string;

    @IsOptional()
    @IsString()
    patronymic: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsString()
    email: string;
}