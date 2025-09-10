import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrdersEntity} from "./orders.entity";
import {Repository} from "typeorm";
import {ResponseHelper} from "../common/helpers/response.helper";
import {CartService} from "../cart/cart.service";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {CartItemsService} from "../cart/cart-items/cart-items.service";
import {CreateOrderDTO} from "./DTO/create-orders.dto";
import {WtnIdOrdersDto} from "./DTO/wtn-id-orders.dto";

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);
    constructor(
        @InjectRepository(OrdersEntity)
        private readonly ordersRepository: Repository<OrdersEntity>,
        private readonly cartService: CartService,
        private readonly cartItemsService: CartItemsService,
    ) {}

    public async getAllOrders(): Promise<OrdersEntity[]> {
        this.logger.log(`Fetching All Orders`);
        try {
            const orders = await this.ordersRepository.find();

            if (orders.length === 0) {
                this.logger.warn('No orders found');
                throw new Error(ErrorCodes.ORDER_NOT_FOUND)
            }

            this.logger.log(`Found ${orders.length} Orders`);
            return orders;
        } catch (error) {
            this.logger.error('Failed to fetch Orders');

            if(error.message === ErrorCodes.ORDER_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async getOrdersById(userId: string): Promise<OrdersEntity[]> {
        this.logger.log(`Fetching Orders by userId: ${userId}`);
        try {
            const orders = await this.ordersRepository.findBy({
                userId: userId
            })

            if (!orders) {
                this.logger.warn(`Order with by user ID: ${userId} not found`)
                new Error(ErrorCodes.ORDER_NOT_FOUND);
            }

            return orders;
        } catch (error) {
            if (error.message === ErrorCodes.ORDER_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }

    }

    public async newOrder(createData: CreateOrderDTO): Promise<WtnIdOrdersDto> {
        this.logger.log(`New Order with by user Id: ${createData.userId}`);

        const exCart = await this.cartService.getCart(createData.userId)

        if (!exCart) {
            this.logger.warn(`Cart with by userId: ${createData.userId} not found`);
            throw new Error(ErrorCodes.CART_NOT_FOUND)
        }

        try {
            this.logger.log(`Fetching Cart items with Id: ${exCart.cartItemsId}`);

            const cartItems = await this.cartItemsService.getCartItems(exCart.cartItemsId)

            if (cartItems.items.tShirtId === '') {
                this.logger.warn(`Cart items with bu userId: ${createData.userId} not found`);
                throw new Error(ErrorCodes.CART_ITEMS_NOT_FOUND)
            }


            const newOrder = this.ordersRepository.create({
                userId: createData.userId,
                totalCount: createData.totalCount,
                totalAmount: createData.totalAmount,
                address: createData.address,
                items: cartItems.items,
                created_at: new Date()
            })

            const saved = await this.ordersRepository.save(newOrder);
            this.logger.log(`Added order with Id: ${saved.id} in date: ${saved.created_at}`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {id, ...Orders} = saved

            return Orders;
        } catch (error) {

            if(error.message === ErrorCodes.CART_NOT_FOUND) {
                throw error;
            }

            if(error.message === ErrorCodes.CART_ITEMS_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async updateStageOrder(userId: string, stage: string): Promise<WtnIdOrdersDto> {
        this.logger.log(`Updating order with userId: ${userId}`);
        try {
            const order = await this.ordersRepository.findOne({
                where: {userId: userId},
                order: {created_at: 'DESC'}
            })

            if (!order) {
                this.logger.warn(`User with ID: ${userId} not found`);
                throw new Error(ErrorCodes.ORDER_NOT_FOUND);
            }

            this.ordersRepository.merge(order, {stage: stage});
            const updOrder = await this.ordersRepository.save(order);

            this.logger.log(`Updating stage on: ${stage} order with Id: ${updOrder.id}`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {id, ...orders} = updOrder;
            return orders;
        } catch (error) {

            if(error.message === ErrorCodes.ORDER_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }
}