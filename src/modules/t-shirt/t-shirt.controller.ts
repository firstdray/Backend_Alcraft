import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {TShirtService} from "./t-shirt.service";
import {TShirtEntity} from "./t-shirt.entity";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";
import {CreateTShirtDTO} from "./DTO/create-t-shirt.dto";

@Controller('t-shirts')
export class TShirtController {
    constructor(private readonly tShirtService: TShirtService) {}

    @Get('/get')
    @HttpCode(HttpStatus.OK)
    getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtService.getTShirt();
    }

    @Post('/create')
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

    @Put('/update/:id')
    @HttpCode(HttpStatus.OK)
    updateTShirt(@Param('id') id: string, @Body() updateData: UpdateTShirtDto
    ): Promise<TShirtEntity> {
        return this.tShirtService.updateTShirt(id, updateData);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteTShirt(@Param('id') id: string) {
        return this.tShirtService.deleteTShirt(id);
    }

}
