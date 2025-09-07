import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CartItem} from "./interfaces/cart-items.interfaces";

@Entity('cart-items')
export class CartItemsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'cart_items_id'})
    cartItemsId: string;

    @Column({type: 'jsonb', default: []})
    items: CartItem;
}