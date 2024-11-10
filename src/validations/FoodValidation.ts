import Joi from "joi";

const createFoodValidation=Joi.object({
    name:Joi.string().required().min(3),
    price:Joi.number().positive().min(3),
    stock:Joi.number().positive().min(1),
});

const getFoodValidation=Joi.string().required();

const updateFoodValidation=Joi.object({
    name:Joi.string().required().min(3),
    price:Joi.number().positive().min(3),
    stock:Joi.number().positive().min(1),
});

export {
    createFoodValidation,
    getFoodValidation,
    updateFoodValidation
}