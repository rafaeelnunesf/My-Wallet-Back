import db from "../db.js";

export async function entries(req, res) {
  const { userId } = res.locals;

  try {
    let entrie;
    if (req.params.IDentrie === "input")
      entrie = {
        ...req.body,
        userId,
        value: Math.abs(req.body.value),
      };
    else
      entrie = {
        ...req.body,
        userId,
        value: -Math.abs(req.body.value),
      };

    await db.collection("entries").insertOne(entrie);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getEntries(req, res) {
  const { userId } = res.locals;

  try {
    const entries = await db.collection("entries").find({ userId }).toArray();

    if (entries) {
      res.send(entries);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
