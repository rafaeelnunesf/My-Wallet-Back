import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
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

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

app.post("/register", async (req, res) => {
  const user = req.body;
  const passwordHashed = bcrypt.hashSync(user.password, 10);
  const validation = userSchema.validate(user, { abortEarly: true });

  if (validation.error) {
    return res.status(422).send(validation.error.details);
  }
  try {
    const userExist = await db
      .collection("users")
      .findOne({ $or: [{ name: user.name }, { email: user.email }] });

    if (userExist) {
      if (userExist.name === user.name) {
        return res
          .status(409)
          .send("Nome de usuário já cadastrado! Tente outro por favor.");
      } else if (userExist.email === user.email) {
        return res
          .status(409)
          .send("email já cadastrado! Tente outro por favor.");
      }
    }

    await db
      .collection("users")
      .insertOne({ ...user, password: passwordHashed });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("servidor rodando na porta 5000...");
});
