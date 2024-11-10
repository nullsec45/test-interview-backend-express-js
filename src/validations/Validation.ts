import ResponseError from "../errors/ResponseError";
import { Request } from "express";
import Joi, { Schema } from 'joi';

class Validation{
   
    static validate<T extends Schema>(schema:T,request:Request | any){
        const result = schema.validate(request, {
            abortEarly: false,
            allowUnknown: false,
        });

        if (result.error) {
            throw new ResponseError(400, result.error.message);
        } else {
            return result.value;
        }
    }

}

export default Validation;