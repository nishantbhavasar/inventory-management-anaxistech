import Joi from "joi";
import { isValidObjectId } from "mongoose";

export function validatePayload(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req?.body ?? {});
    if (error) {
      next({
        message: error.details[0].message,
        status: 400,
      });
    } else {
      next();
    }
  };
}

export function validateId(req, res, next) {
  const validateId = isValidObjectId(req?.params?.id);
  if (validateId) {
    next();
  } else {
    next({
      message: "Id format is wrong",
      status: 400,
    });
  }
}
