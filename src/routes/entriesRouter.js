import { Router } from "express";
import { entries, getEntries, deleteEntries, editEntrie } from "../controllers/entriesController.js";
import entriesSchemaValidationMiddleware from "../middlewares/entriesValidationMiddlewares/entriesSchemaValidationMiddleware.js";
import rightParamsValidationMiddleware from "../middlewares/entriesValidationMiddlewares/rightParamsValidationMiddleware.js";
import tokenValidationMiddleware from "../middlewares/entriesValidationMiddlewares/tokenValidationMiddleware.js";

const entriesRouter = Router();
entriesRouter.use(tokenValidationMiddleware);
entriesRouter.delete("/entries/:_id",deleteEntries)
entriesRouter.put(
  "/entries/edit/:type",
  entriesSchemaValidationMiddleware,
  rightParamsValidationMiddleware,
  editEntrie)
entriesRouter.get("/home", getEntries);
entriesRouter.post(
  "/entries/add/:type",
  entriesSchemaValidationMiddleware,
  rightParamsValidationMiddleware,
  entries
);

export default entriesRouter;
