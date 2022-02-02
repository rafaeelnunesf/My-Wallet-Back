import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect(() => {
  db = mongoClient.db("My-Wallet");
});

app.listen(5000, () => {
  console.log("servidor rodando na porta 5000...");
});
