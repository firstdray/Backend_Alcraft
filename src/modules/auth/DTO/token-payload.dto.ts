import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class TokenPayloadDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    constructor(partial: Partial<TokenPayloadDTO>) {
        Object.assign(this, partial);
    }
}