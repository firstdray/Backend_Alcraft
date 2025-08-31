import {IsNotEmpty, IsOptional, IsString, ValidateIf} from "class-validator";

export class CheckAuthDTO {
    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    phone: string;

    @ValidateIf(o => !o.email && !o.phone)
    @IsNotEmpty()
    message = 'Either email or phone must be provided';

    @IsNotEmpty()
    @IsString()
    pass: string;
}