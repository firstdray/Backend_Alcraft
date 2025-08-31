import {
    Body, ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, Logger, NotFoundException,
    Param,
    Post,
    Put
} from '@nestjs/common';
import {TShirtService} from "./t-shirt.service";
import {TShirtEntity} from "./t-shirt.entity";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";
import {CreateTShirtDTO} from "./DTO/create-t-shirt.dto";
import {SuccessResponse} from "../common/interface/api-response.interface";
import {ResponseHelper} from "../common/helpers/response.helper";

@Controller('t-shirts')
export class TShirtController {
    private readonly logger = new Logger(TShirtService.name);
    constructor(private readonly tShirtService: TShirtService) {}

    @Get('/get')
    @HttpCode(HttpStatus.OK)
    async getTShirt(): Promise<SuccessResponse<TShirtEntity[]>> {
        try {
            const tShirts = await this.tShirtService.getTShirt()
            return ResponseHelper.tShirtsFound(tShirts);
        } catch (error) {
            this.logger.error(`Failed to fetch T-shirts`, error.stack);
            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createTShirt(@Body() createTShirtDTO: CreateTShirtDTO): Promise<SuccessResponse<TShirtEntity>> {
        try {
            const tShirt = await this.tShirtService.addTShirt(createTShirtDTO);
            return ResponseHelper.tShirtCreated(tShirt)
        } catch (error) {
            this.logger.error('Failed to add T-shirt', error);

            if (error instanceof ConflictException) {
                throw new ConflictException(ResponseHelper.tShirtAlreadyExists())
            }
            throw new InternalServerErrorException(ResponseHelper.internalError())
        }

    }

    @Put('/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateTShirt(@Param('id') id: string, @Body() updateData: UpdateTShirtDto
    ): Promise<SuccessResponse<TShirtEntity>> {
        try {
            const tShirt = await this.tShirtService.updateTShirt(id, updateData);
            return ResponseHelper.tShirtUpdated(tShirt);
        } catch (error) {
            this.logger.error(`Failed to update T-shirt ${id}`, error);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(ResponseHelper.tShirtNotFound())
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTShirt(@Param('id') id: string): Promise<SuccessResponse<null>> {
        try {
            await this.tShirtService.deleteTShirt(id);
            return ResponseHelper.tShirtDeleted();
        } catch (error) {
            this.logger.error(`Failed to delete T-shirt ${id}`, error);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(ResponseHelper.tShirtNotFound())
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

}
