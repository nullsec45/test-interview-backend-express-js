import { Request, Response, NextFunction } from "express";
import OrderService from "../services/OrderService";
import IController from "./ControllerInterface";
import { UserRequest } from "../types/UserRequest";
import { CreateOrderRequest } from "../models/OrderModel";

class OrderController implements IController{
    index= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const result=await OrderService.index();
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    create= async (req:UserRequest, res:Response, next:NextFunction) => {
        try{
            
            const request:CreateOrderRequest=req.body as CreateOrderRequest;
            
            const result=await OrderService.create(req.user!, request);
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    show= async (req:Request, res:Response, next:NextFunction) => {
        
        
    }

    update= async (req:Request, res:Response, next:NextFunction) => {
        
    }

    delete= async (req:Request, res:Response, next:NextFunction) => {
        
        
    }
}

export default new OrderController();