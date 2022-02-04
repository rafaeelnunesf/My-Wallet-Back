import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import userLoginSchemaValidationMiddleware from "../middlewares/authValidationMiddlewares/userLoginSchemaValidationMiddleware.js";
import userSchemaValidation from "../middlewares/authValidationMiddlewares/userSchemaValidation.js";

const authRouter = Router();

authRouter.post("/register", userSchemaValidation, register);
authRouter.post("/login", userLoginSchemaValidationMiddleware, login);

export default authRouter;
