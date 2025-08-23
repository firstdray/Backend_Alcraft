import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {TShirtService} from "./t-shirt.service";
import {TShirtEntity} from "./t-shirt.entity";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";
import {DeleteResult} from "typeorm";
import {CreateTShirtDTO} from "./DTO/create-t-shirt.dto";

@Controller('t-shirts')
export class TShirtController {
    constructor(private readonly tShirtService: TShirtService) {}

    @Get()
    getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtService.getTShirt();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTShirt(@Body() createTShirtDTO: CreateTShirtDTO): Promise<{
        success: boolean;
        message: string;
        data: TShirtEntity;
    }> {
        const tShirt = await this.tShirtService.addTShirt(createTShirtDTO);

        return {
            success: true,
            message: 'T-shirt added successfully',
            data: tShirt
        };
    }

    @Put(':id')
    updateTShirt(@Param('id') id: string, @Body() updateData: UpdateTShirtDto
    ): Promise<TShirtEntity> {
        return this.tShirtService.updateTShirt(id, updateData);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteTShirt(@Param('id') id: string) {
        return this.tShirtService.deleteTShirt(id);
    }

}
