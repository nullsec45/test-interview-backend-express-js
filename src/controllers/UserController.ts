import { Request, Response, NextFunction } from "express";
import AuthController from "./AuthControllerInterface";
import UserService from "../services/UserService";
import { logger } from "../applications/logger";
import { LoginUserRequest,CreateUserRequest } from "../models/UserModel";

class UserController implements AuthController{
    login= async (req:Request, res:Response, next:NextFunction) => {
       try{
            const request:LoginUserRequest=req.body as LoginUserRequest;
            const result=await UserService.login(request);
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
    }

    register= async (req:Request, res:Response, next:NextFunction) => {
       try{
            const request:CreateUserRequest=req.body as CreateUserRequest;
            const result=await UserService.register(request);

            logger.info(result);
            
            res.status(200).json({
                data: result,
            });
        }catch(error){
            next(error);
        }
    }
}

export default new UserController();