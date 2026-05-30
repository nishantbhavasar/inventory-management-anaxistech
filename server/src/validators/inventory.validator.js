import joi from "joi";

export const createInventory = joi.object({
  name: joi.string().trim(true).required(),
  category: joi
    .string()
    .trim(true)
    .valid(
      ...["Electronic", "Food", "Drink", "Accessories", "Home", "Medicine"],
    )
    .required(),
  quantity: joi.number().required(),
  purchasePrice: joi.number().required(),
  sellingPrice: joi.number().required(),
});

export const updateInventory = joi.object({
  name: joi.string().trim(true),
  category: joi
    .string()
    .trim(true)
    .valid(
      ...["Electronic", "Food", "Drink", "Accessories", "Home", "Medicine"],
    ),
  quantity: joi.number(),
  purchasePrice: joi.number(),
  sellingPrice: joi.number(),
});
