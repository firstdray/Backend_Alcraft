import {
    Body,
    ConflictException,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Param,
    Post
} from "@nestjs/common";
import {OrdersService} from "./orders.service";
import {ResponseHelper} from "../common/helpers/response.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {SuccessResponse} from "../common/interface/api-response.interface";
import {OrdersEntity} from "./orders.entity";
import {CreateOrderDTO} from "./DTO/create-orders.dto";
import {WtnIdOrdersDto} from "./DTO/wtn-id-orders.dto";

@Controller('orders')
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);
    constructor(private readonly ordersService: OrdersService) {}

    @Get('/get')
    async getAllOrders(): Promise<SuccessResponse<OrdersEntity[]>> {
        try {
            const found = await this.ordersService.getAllOrders();
            return ResponseHelper.found('Orders', found, SuccessCodes.ORDER_FOUND);
        } catch(error) {
            this.logger.error(`Failed to fetch Orders`, error.stack);

            if (error.message === ErrorCodes.ORDER_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Orders', ErrorCodes.ORDER_NOT_FOUND));
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Get('/get/:id')
    async getOrdersById(@Param('id') userId: string): Promise<SuccessResponse<OrdersEntity[]>> {
        try {
            const found = await this.ordersService.getOrdersById(userId)
            return ResponseHelper.found('Orders', found, SuccessCodes.ORDER_FOUND)
        } catch (error) {
            this.logger.error('Failed to fetch Orders', error.stack);

            if (error.message === ErrorCodes.ORDER_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Orders', ErrorCodes.ORDER_NOT_FOUND));
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }

    @Post('/create')
    async createOrder(@Body() createData: CreateOrderDTO): Promise<SuccessResponse<WtnIdOrdersDto>> {
        try {
            const newOrder = await this.ordersService.newOrder(createData)
            return ResponseHelper.created('Orders', newOrder, SuccessCodes.ORDER_CREATED)
        } catch (error) {
            this.logger.error('Failed to create Orders', error.stack);

            if (error.message === ErrorCodes.CART_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Orders', ErrorCodes.CART_NOT_FOUND));
            }

            if (error.message === ErrorCodes.CART_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Orders', ErrorCodes.CART_ITEMS_NOT_FOUND));
            }

            throw new ConflictException(ResponseHelper.internalError())
        }
    }
}