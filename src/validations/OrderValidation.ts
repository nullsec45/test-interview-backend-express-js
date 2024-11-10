import Joi from "joi";

const createOrderValidation=Joi.object({
    foodId:Joi.string().required(),
    quantity:Joi.number().positive().min(3),
    money_fractions:Joi.number().valid(2000, 5000, 10000, 20000, 50000).required(),
    money_totals:Joi.number().positive().required(),
});


export {
    createOrderValidation,
}