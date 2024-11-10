import { Request } from "express";
import { prismaClient } from "../applications/database";
import Validation from "../validations/Validation";
import { 
    registerUserValidation, 
    loginUserValidation,
    updateUserValidation 
} from "../validations/UserValidation";
import ResponseError from "../errors/ResponseError";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import { CreateUserRequest, LoginUserRequest, toUserResponse } from "../models/UserModel";

class UserService{
    static async login(request:LoginUserRequest){
        const login=Validation.validate(loginUserValidation, request);

        let user=await prismaClient.user.findFirst({
            where:{
                username:login.username
            }
        });

        if(!user){
            throw new ResponseError(401,"Username or password is wrong");
        }

        const isPasswordValid=await bcrypt.compare(login.password, user.password);

        if(!isPasswordValid){
            throw new ResponseError(401,"Username or password is wrong");
        }

        const now=new Date();

        user = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                token: uuid()+now,
            }
        });

        const response=toUserResponse(user);
        response.token=user.token!;
        return response;

    }

    static async register(request:CreateUserRequest){
        const register=Validation.validate(registerUserValidation, request);

        const totalUserWithSameUser=await prismaClient.user.count({
            where:{
                username:register.username
            }
        });

        if(totalUserWithSameUser !== 0){
            throw new ResponseError(404, "Username already exists");
        }

        register.password=await bcrypt.hash(register.password, 10);

        const user=await prismaClient.user.create({
            data:register
        });

        return toUserResponse(user);
    }
}

export default UserService;