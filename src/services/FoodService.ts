import { Request } from "express";
import { prismaClient } from "../applications/database";
import Validation from "../validations/Validation";
import { 
    createFoodValidation, 
    getFoodValidation,
    updateFoodValidation 

} from "../validations/FoodValidation";
import ResponseError from "../errors/ResponseError";
import { CreateFoodRequest, FoodResponse, toFoodResponse, toFoodStockAndPriceResponse, UpdateFoodRequest } from "../models/FoodModel";

class FoodService{
    static index(){
        return prismaClient.food.findMany({});
    }

    static async create(request:CreateFoodRequest):Promise<FoodResponse>{
        const foodRequest=Validation.validate(createFoodValidation, request);

        const food= await prismaClient.food.create({
            data:foodRequest,
            select:{
                id:true,
                name:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true
            }
        });

        return toFoodResponse(food);
    }


    static async checkExistsFood(id:string){
        const checkFood = await prismaClient.food.findFirst({
            where: {
                id,
            },
        });

        return checkFood !== null;  
    }


    static async get(id:string):Promise<FoodResponse>{
        const foodId=Validation.validate(getFoodValidation, id);

        const food=await prismaClient.food.findFirst({
            where:{
                id:foodId
            },
            select:{
                id:true,
                name:true,
                price:true,
                stock:true,
                 createdAt:true,
                updatedAt:true
            }
        })

        if(!food){
            throw new ResponseError(404, "Food is not found!");
        }

        return toFoodResponse(food);
    }

    static async update(id:string, request:UpdateFoodRequest):Promise<FoodResponse>{
        const foodRequest=Validation.validate(updateFoodValidation, request);

        const checkFood = await this.checkExistsFood(id);

        if (!checkFood) {
            throw new ResponseError(404, "Food is not found!");
        }

        const food= await prismaClient.food.update({
            where:{
                id
            },
            data:{
                name:foodRequest.name,
                price:foodRequest.price,
                stock:foodRequest.stock
            },
            select:{
                id:true,
                name:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true
            }
        });

        return toFoodResponse(food);
    }

    static async remove(id:string):Promise<FoodResponse>{
       const foodId =Validation.validate(getFoodValidation, id);

        const checkFood =await FoodService.checkExistsFood(foodId);


        if (!checkFood) {
            throw new ResponseError(404, "Food is not found");
        }

        const food= await prismaClient.food.delete({
            where: {
              id: foodId,
            },
        });

        return toFoodResponse(food);
    }

    static async checkStockAndPrice(id:string){
        const checkFood = await this.checkExistsFood(id);

        if (!checkFood) {
            throw new ResponseError(404, "Food is not found!");
        }

        const food=await prismaClient.food.findFirst({
            where:{
                id,
            },
            select:{
                stock:true,
                price:true,
                createdAt:true,
                updatedAt:true
            }
        });

        if(food?.stock == 0){
            throw new ResponseError(422, "Out of stock");
        }else{
            return toFoodStockAndPriceResponse(food);
        }
    }

   
}

export default FoodService;