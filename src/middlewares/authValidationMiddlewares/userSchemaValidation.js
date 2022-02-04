import userSchema from "../../schemas/userSchema.js";

export default function userSchemaValidation(req, res, next) {
  const validation = userSchema.validate(req.body, { abortEarly: true });
  if (validation.error) {
    return res.status(422).send(validation.error.details);
  }
  next();
}
