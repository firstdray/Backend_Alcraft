import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrdersEntity} from "./orders.entity";
import {Repository} from "typeorm";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrdersEntity)
        private readonly ordersRepository: Repository<OrdersEntity>,
    ) {}

    public async getOrdersById(id: string): Promise<OrdersEntity[]> {
        const orders = await this.ordersRepository.findBy({
            userId: id
        })

        if (!orders) {
             new Error(`Order with id ${id} not found`);
        }

        return orders;
    }
}