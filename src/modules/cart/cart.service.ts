import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CartEntity} from "./cart.entity";
import {Repository} from "typeorm";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {ResponseHelper} from "../common/helpers/response.helper";
import * as uuid from "uuid";

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);
    constructor(
    @InjectRepository(CartEntity)
    private readonly cartEntityRepository: Repository<CartEntity>,
    ) {
    }

    public async getCart(userId: string): Promise<CartEntity> {
        this.logger.log(`Fetching Cart by userId: ${userId}`);

        try {
            const cart = await this.cartEntityRepository.findOneBy({
                userId: userId
            })

            if (!cart) {
                this.logger.warn(`Cart with Id: ${cart.cartId} not found`);
                throw new Error(ErrorCodes.CART_NOT_FOUND);
            }

            return cart;
        } catch (error) {
            this.logger.error(`Cart not found`);

            if (error === ErrorCodes.CART_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async addCart(userId: string): Promise<CartEntity> {
        this.logger.log(`Adding new Cart for user: ${userId}`);
        try {
            const newCart = this.cartEntityRepository.create({
                cartId: uuid.v4(),
                userId: userId,
                cartItemsId: uuid.v4()
            })

            const saved = await this.cartEntityRepository.save(newCart);
            this.logger.log(`Cart with Id: ${saved.id} saved successfully`);

            return saved;
        } catch (error) {
            if (error.message === ErrorCodes.CART_ALREADY_EXISTS) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }
}