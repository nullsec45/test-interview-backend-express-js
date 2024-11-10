import { Food } from "@prisma/client";

export type FoodResponse={
    id:string;
    name:string;
    price:number;
    stock:number;
}

export type FoodStockAndPriceResponse={
    price:number;
    stock:number;
}

export type CreateFoodRequest={
    name:string;
    price:number;
    stock:number;
}

export function toFoodResponse(food:Food):FoodResponse{
    return {
        id:food.id,
        name:food.name,
        price:food.price.toNumber(),
        stock:food.stock
    }
}

export function toFoodStockAndPriceResponse(food:any):FoodStockAndPriceResponse{
    return {
        price:food.price.toNumber(),
        stock:food.stock
    }
}


export type UpdateFoodRequest={
    name:string,
    price:number,
    stock:number,
}