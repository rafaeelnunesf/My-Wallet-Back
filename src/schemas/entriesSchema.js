import joi from "joi";

const entriesSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  date: joi
    .string()
    .pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    .required(),
});
export default entriesSchema;
