import { Request, Response, NextFunction } from "express";
import FoodService from "../services/FoodService";
import IController from "./ControllerInterface";

class FoodController implements IController{
    index= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const result=await FoodService.index();
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    create= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const result=await FoodService.create(req.body);
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    show= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const foodUUID=req.params.uuid;
            const result=await FoodService.get(foodUUID);

            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    update= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const foodUUID=req.params.uuid;
            const request=req.body;
            const result=await FoodService.update(foodUUID, request);

            res.status(200).json({
                message:"Update Success",
                data: result,
            });
        }catch(error){
            next(error);
        }
        
    }

    delete= async (req:Request, res:Response, next:NextFunction) => {
        try{
            const foodUUID=req.params.uuid;
            await FoodService.remove(foodUUID);

            res.status(200).json({
                 message: "Delete Success",
            });
        }catch(error){
            next(error);
        }
        
    }
}

export default new FoodController();