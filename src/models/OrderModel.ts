
export type OrderSuccessResponse={
    message:string;
    money_refund:number;
    receipt:object;
}

export type CreateOrderRequest={
    userId:number
    foodId:string;
    quantity:number;
    money_fractions:number;
    money_totals:number;
    total:number;
}

export function toOrderSuccessResponse(order:any):OrderSuccessResponse{
    return {
        message:order.message,
        money_refund:order.money_refund,
        receipt:{
            foodId:order.receipt.foodId,
            total:order.receipt.total,
            date:order.receipt.date
        }
    }
}
