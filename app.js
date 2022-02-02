import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import joi from "joi";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
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

const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

app.post("/register", async (req, res) => {
  const user = req.body;

  const validation = userSchema.validate(user, { abortEarly: true });

  if (validation.error) {
    return res.status(422).send(validation.error.details);
  }
  try {
    const passwordHashed = bcrypt.hashSync(user.password, 10);
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = userLoginSchema.validate(req.body, { abortEarly: true });
  if (validation.error) {
    return res.status(422).send(validation.error.details);
  }
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send("Usuário não cadastrado! Tente outro por favor.");
    }

    const passwordsMatch = bcrypt.compareSync(password, user.password);
    if (passwordsMatch) {
      const token = uuid();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      return res.send({ name: user.name, id: user._id, token });
    }
    res.status(403).send("Senha inválida");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/home", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.sendStatus(401);

    const user = await db.collection("users").findOne({ _id: session.userId });

    if (user) {
      delete user.password;
      res.send(user);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.listen(5000, () => {
  console.log("servidor rodando na porta 5000...");
});
