import {
    Body,
    ConflictException,
    Controller, Get, HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger, Param,
    Post
} from "@nestjs/common";
import {CartService} from "./cart.service";
import {addItemDTO} from "./cart-items/DTO/create-cart-items.dto";
import {CartItemsEntity} from "./cart-items/cart-items.entity";
import {CartItemsService} from "./cart-items/cart-items.service";
import {ResponseHelper} from "../common/helpers/response.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {SuccessResponse} from "../common/interface/api-response.interface";

@Controller('cart')
export class CartController {
    private readonly logger = new Logger(CartController.name);
    constructor(private readonly cartService: CartService, private readonly cartItemsService: CartItemsService) {}

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getItem(@Param('id') userId: string): Promise<SuccessResponse<CartItemsEntity>> {
        try {
            const cart = await this.cartService.getCart(userId)

            const getItems = await this.cartItemsService.getCartItems(cart.cartItemsId)
            return ResponseHelper.found('Cart items', getItems, SuccessCodes.CART_ITEMS_FOUND)
        } catch (error) {
            this.logger.error(`Failed to get cartItems`, error.stack);

            if (error.message === ErrorCodes.CART_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Cart', ErrorCodes.CART_NOT_FOUND));
            }

            if (error.message === ErrorCodes.CART_ITEMS_NOT_FOUND) {
                throw new ConflictException(ResponseHelper.notFound('Cart items', ErrorCodes.CART_ITEMS_NOT_FOUND));
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }

    }


    @Post('/add')
    @HttpCode(HttpStatus.CREATED)
    async addItem(@Body() item: addItemDTO): Promise<SuccessResponse<CartItemsEntity>> {
        try {
            const cart = await this.cartService.getCart(item.userId)

            const add = await this.cartItemsService.addCartItems(cart.cartItemsId, item.items)
            return ResponseHelper.created('Cart items', add, SuccessCodes.CART_ADDED);
        } catch (error) {
            this.logger.error('Failed to add items in cart', error.stack);

            if (error.message === ErrorCodes.CART_ALREADY_EXISTS) {
                throw new ConflictException(ResponseHelper.alreadyExists('Cart', ErrorCodes.CART_ALREADY_EXISTS))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }
}