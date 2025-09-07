import {IsArray, IsString} from "class-validator";
import {CartItem} from "../interfaces/cart-items.interfaces";

export class addItemDTO {
    @IsString()
    userId: string;

    @IsArray()
    items: CartItem;
}