export interface CartItem {
    tShirtId: string;
    count: number;
    price: number;
    size: Array<string>;
    density: Array<string>;
    discount: number;
    color: string;
}