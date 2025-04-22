export interface Order{
    id_order: number;
    user: number;
    state: string;
    order_date: number;
    payment_method: string;
    shipping_method: string;
    payment_status: string;
    total_amount: number;
    order_items: OrderITem[];
}
export interface OrderITem{
    id_order_items: number;
    product_id: number;
    quantity: number;
    order_id: number;
}
export interface OrderRequestBody {
    order_items: { product: number; quantity: number }[];
}












/* ; id_order_items:number;order_id:number */
/* export interface OrderRequestBody extends Array<{ product_id: number; quantity: number }> {}
 */
/* export interface OrderRequestBody {
    order_items: { product_id: number; quantity: number }[];
  } */
  

