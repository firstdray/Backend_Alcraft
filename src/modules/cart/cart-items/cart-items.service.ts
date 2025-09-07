import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CartItemsEntity} from "./cart-items.entity";
import {Repository} from "typeorm";
import {ErrorCodes} from "../../common/enum/error-codes.enum";
import {ResponseHelper} from "../../common/helpers/response.helper";
import {CartItem} from "./interfaces/cart-items.interfaces";

@Injectable()
export class CartItemsService {
    private readonly logger = new Logger(CartItemsService.name);
    constructor(
        @InjectRepository(CartItemsEntity)
        private readonly cartItemsRepository: Repository<CartItemsEntity>,
    ) {
    }

    public async getCartItems(cartItemsId: string): Promise<CartItemsEntity> {
        this.logger.log(`Fetching Cart items with Id: ${cartItemsId}`);

        try {
            const cartItems = await this.cartItemsRepository.findOneBy({
                cartItemsId: cartItemsId
            })

            if (!cartItems) {
                this.logger.warn(`Fetching Cart items with Id: ${cartItemsId} not found`);
                throw new Error(ErrorCodes.CART_ITEMS_NOT_FOUND);
            }

            return cartItems;
        } catch (error) {
            this.logger.error(`Fetching Cart items with Id: ${cartItemsId} not found`);

            if (error === ErrorCodes.CART_ITEMS_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async addCartItems(cartItemsId: string, itemsData: CartItem): Promise<CartItemsEntity> {
        this.logger.log(`Adding Cart items with Id: ${cartItemsId}`);
        try {
            const exCartItems = await this.cartItemsRepository.findOneBy({
                cartItemsId: cartItemsId
            })

            if (exCartItems) {
                this.cartItemsRepository.merge(exCartItems, { items: itemsData });
                const upd = await this.cartItemsRepository.save(exCartItems);

                this.logger.log(`Cart items with Id: ${upd.cartItemsId} updated successfully`)
                return upd;
            } else {
                const newItems = this.cartItemsRepository.create({
                    cartItemsId: cartItemsId,
                    items: itemsData
                })

                const saved = await this.cartItemsRepository.save(newItems);
                this.logger.log(`Add Cart items with Id: ${saved.cartItemsId} saved successfully`);
                return saved;
            }
        } catch (error) {
            this.logger.error(`Adding Cart items with Id: ${cartItemsId}`);

            if (error.message === ErrorCodes.CART_ITEMS_ALREADY_EXISTS) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }
}