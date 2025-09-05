import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('cart')
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'user_id'})
    userId: string

    @Column({name: 'cart_id'})
    cartId: string;

    @Column({name: 'cart_items_id'})
    cartItemsId: string;
}