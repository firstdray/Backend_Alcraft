import {IsArray, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateTShirtDto {
    @IsOptional()
    @IsString()
    tShirtName?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

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
    density?: number[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    techInfo?: string[];

    @IsOptional()
    @IsArray()
    cut?: string;

    @IsOptional()
    @IsArray()
    color?: string;
}