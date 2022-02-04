import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(router);

app.listen(5000, () => {
  console.log("servidor rodando na porta 5000...");
});
