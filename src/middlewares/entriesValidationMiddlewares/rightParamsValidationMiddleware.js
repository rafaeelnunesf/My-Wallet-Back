export default function rightParamsValidationMiddleware(req, res, next) {
  if (!(req.params.IDentrie === "input" || req.params.IDentrie === "output"))
    return res.sendStatus(404);

  next();
}
