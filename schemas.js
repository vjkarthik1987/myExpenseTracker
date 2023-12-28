const Joi = require('joi');

const expenseSchema = Joi.object({
    item: Joi.string().required(),
    price: Joi.number().required().min(0),
    date: Joi.date().required(),
    category: Joi.string().required(),
    mode: Joi.string().required(),
    shop: Joi.string(),
    note: Joi.string()
})

module.exports = expenseSchema;