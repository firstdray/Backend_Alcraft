import {
    Body,
    ConflictException,
    Controller, HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
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

    @Post('/add')
    @HttpCode(HttpStatus.CREATED)
    async addItem(@Body() item: addItemDTO): Promise<SuccessResponse<CartItemsEntity>> {
        try {
            const cart = await this.cartService.getCart(item.userId)

            const add = await this.cartItemsService.addCartItems(cart.cartItemsId, item.items)
            return ResponseHelper.created('Cart', add, SuccessCodes.CART_ADDED);
        } catch (error) {
            this.logger.error('Failed to add items in cart', error.stack);

            if (error.message === ErrorCodes.CART_ALREADY_EXISTS) {
                throw new ConflictException(ResponseHelper.alreadyExists('Cart', ErrorCodes.CART_ALREADY_EXISTS))
            }

            throw new InternalServerErrorException(ResponseHelper.internalError())
        }
    }
}