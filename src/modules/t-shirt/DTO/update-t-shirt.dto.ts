import {IsArray, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateTShirtDto {
    @IsOptional()
    @IsString()
    tShirtName?: string;

    @IsOptional()
    @IsNumber()
    price?: string;

    @IsOptional()
    @IsNumber()
    discount?: string;

    @IsOptional()
    @IsString()
    nameCollection?: string;

    @IsOptional()
    @IsArray()
    picturePath?: string[];

    @IsOptional()
    @IsArray()
    size?: string[];

    @IsOptional()
    @IsArray()
    density?: string[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    techInfo?: string[];
}