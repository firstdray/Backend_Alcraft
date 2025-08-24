import {IsOptional, IsString} from "class-validator";

export class UpdateUserDTO {
    @IsOptional()
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

    @IsOptional()
    @IsString()
    email: string;
}