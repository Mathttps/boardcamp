import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().required().greater(0),
    pricePerDay: joi.number().required().greater(0)
})