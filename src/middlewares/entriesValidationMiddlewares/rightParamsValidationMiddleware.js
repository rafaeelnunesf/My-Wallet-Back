export default function rightParamsValidationMiddleware(req, res, next) {
  if (!(req.params.type === "input" || req.params.type === "output"))
    return res.sendStatus(404);

  next();
}
