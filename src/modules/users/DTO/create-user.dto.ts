import {IsDate, IsOptional, IsString} from "class-validator";

export class CreateUserDTO {
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

    @IsOptional()
    @IsDate()
    dateOfBirth: Date;
}