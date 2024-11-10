import { Request } from "express";
import { prismaClient } from "../applications/database";
import Validation from "../validations/Validation";
import { createOrderValidation } from "../validations/OrderValidation";
import { CreateOrderRequest,toOrderSuccessResponse } from "../models/OrderModel";
import FoodService from "./FoodService";
import ResponseError from "../errors/ResponseError";
import { User } from "@prisma/client";


class OrderService{
    static index(){
        return prismaClient.order.findMany({});
    }

    static async create(user:User, request:CreateOrderRequest){
        const orderRequest=Validation.validate(createOrderValidation, request);
        await FoodService.checkExistsFood(request.foodId);

        const checkStockAndPrice=await FoodService.checkStockAndPrice(request.foodId);
        const total=request.quantity * checkStockAndPrice.price;

        if(request.quantity > checkStockAndPrice.stock){
            throw new ResponseError(422,"Out of stock.");
        }

        if(request.money_totals < total){
            throw new ResponseError(422,"Your money is not enough.");
        }

        const money_refund=request.money_totals - total;

        const {foodId, quantity,}=orderRequest;
        const record={
            foodId,
            quantity,
            ...{userId:user.id, total}
        }

       await prismaClient.$transaction([
            prismaClient.order.create({
                data:record,
                select:{
                    id:true,
                    userId:true,
                    foodId:true,
                    quantity:true,
                    total:true,
                }
            }),
            prismaClient.food.update({
                where: { id: foodId },
                data: {
                stock: { decrement: quantity },
                },
            }),
        ]);
        

        return toOrderSuccessResponse({
            message:"Transaction Success",
            money_refund:money_refund,
            receipt:{
                foodId,
                total:total,
                date:new Date()
            }
        });
    }
}

export default OrderService;