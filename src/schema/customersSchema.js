import joi from "joi"

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().iso(true).required()
})