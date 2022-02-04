import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../db.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send("Usuário não cadastrado! Tente outro por favor.");
    }

    const passwordsMatch = bcrypt.compareSync(password, user.password);
    if (passwordsMatch) {
      const hasToken = await db
        .collection("sessions")
        .findOne({ userId: user._id });
      if (hasToken) {
        await db.collection("sessions").deleteOne(hasToken);
      }

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
}

export async function register(req, res) {
  const user = req.body;

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
}
