import entriesSchema from "../../schemas/entriesSchema.js";

export default function entriesSchemaValidationMiddleware(req, res, next) {
  const validation = entriesSchema.validate(req.body, { abortEarly: true });
  if (validation.error) return res.status(422).send(validation.error.details);

  next();
}
