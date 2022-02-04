import userLoginSchema from "../../schemas/userLoginSchema.js";

export default function userLoginSchemaValidationMiddleware(req, res, next) {
  const validation = userLoginSchema.validate(req.body, { abortEarly: true });
  if (validation.error) {
    return res.status(422).send(validation.error.details);
  }
  next();
}
