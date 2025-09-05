import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    NotFoundException,
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
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {ErrorCodes} from "../common/enum/error-codes.enum";

@Controller('t-shirts')
export class TShirtController {
    private readonly logger = new Logger(TShirtService.name);
    constructor(private readonly tShirtService: TShirtService) {}

    @Get('/get')
    @HttpCode(HttpStatus.OK)
    async getTShirt(): Promise<SuccessResponse<TShirtEntity[]>> {
        try {
            const tShirts = await this.tShirtService.getTShirt()
            return ResponseHelper.found('T-Shirts', tShirts, SuccessCodes.TSHIRT_FOUND);
        } catch (error) {
            this.logger.error(`Failed to fetch T-Shirts`, error.stack);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(ResponseHelper.notFound('T-Shirts', ErrorCodes.TSHIRT_NOT_FOUND));
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createTShirt(@Body() createTShirtDTO: CreateTShirtDTO): Promise<SuccessResponse<TShirtEntity>> {
        try {
            const tShirt = await this.tShirtService.addTShirt(createTShirtDTO);
            return ResponseHelper.created('T-Shirts', tShirt, SuccessCodes.TSHIRT_CREATED);
        } catch (error) {
            this.logger.error('Failed to add T-shirt', error.stack);

            if (error instanceof ConflictException) {
                throw new ConflictException(ResponseHelper.alreadyExists('T-Shirt', ErrorCodes.TSHIRT_ALREADY_EXISTS));
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
            return ResponseHelper.updated('T-Shirts', tShirt, SuccessCodes.TSHIRT_UPDATED);
        } catch (error) {
            this.logger.error(`Failed to update T-shirt ${id}`, error.stack);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(ResponseHelper.notFound('T-Shirts', ErrorCodes.TSHIRT_NOT_FOUND))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTShirt(@Param('id') id: string): Promise<SuccessResponse<null>> {
        try {
            await this.tShirtService.deleteTShirt(id);
            return ResponseHelper.delete('T-Shirts', null, SuccessCodes.TSHIRT_DELETED);
        } catch (error) {
            this.logger.error(`Failed to delete T-shirt ${id}`, error.stack);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(ResponseHelper.notFound('T-Shirts', ErrorCodes.TSHIRT_NOT_FOUND))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

}
