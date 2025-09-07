import {CartItem} from "../../cart/cart-items/interfaces/cart-items.interfaces";

export class WtnIdOrdersDto {
    userId: string;
    items: CartItem
    totalCount: string;
    totalAmount: string;
    stage: string;
    created_at: Date;
}