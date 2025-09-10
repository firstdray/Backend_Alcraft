import {BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from "typeorm";
import {CartItem} from "../cart/cart-items/interfaces/cart-items.interfaces";

@Entity('orders')
export class OrdersEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({name: 'user_id'})
    userId: string;

    @Column({type: 'jsonb'})
    items: CartItem

    @Column({name: 'total_count'})
    totalCount: string;

    @Column({name: 'total_amount'})
    totalAmount: string;

    @Column()
    address: string;

    @Index()
    @Column({nullable: true})
    stage: string;

    @CreateDateColumn()
    created_at: Date;
}