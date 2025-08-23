import {IsArray, IsNumber, IsOptional, IsString, Min} from "class-validator";

export class CreateTShirtDTO {
    @IsString()
    tShirtId: string;

    @IsString()
    tShirtName: string;

    @IsString()
    nameCollection: string;

    @IsOptional()
    @IsString()
    collectionID: string;

    @IsString()
    color: string;

    @IsString()
    cut: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    picturePath?: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    discount?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    techInfo?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    size?: string[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    density?: number[];

    @IsOptional()
    @IsString()
    description?: string;
}