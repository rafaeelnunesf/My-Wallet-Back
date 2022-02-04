import { Router } from "express";
import { entries, getEntries } from "../controllers/entriesController.js";
import entriesSchemaValidationMiddleware from "../middlewares/entriesValidationMiddlewares/entriesSchemaValidationMiddleware.js";
import rightParamsValidationMiddleware from "../middlewares/entriesValidationMiddlewares/rightParamsValidationMiddleware.js";
import tokenValidationMiddleware from "../middlewares/entriesValidationMiddlewares/tokenValidationMiddleware.js";

const entriesRouter = Router();
entriesRouter.use(tokenValidationMiddleware);
entriesRouter.get("/home", getEntries);
entriesRouter.post(
  "/entries/:IDentrie",
  entriesSchemaValidationMiddleware,
  rightParamsValidationMiddleware,
  entries
);

export default entriesRouter;
