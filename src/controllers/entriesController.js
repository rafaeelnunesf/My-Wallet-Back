import { ObjectId } from "mongodb";
import db from "../db.js";

export async function entries(req, res) {
  const { userId } = res.locals;

  try {
    let entrie;
    if (req.params.type === "input")
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

export async function deleteEntries(req, res) {
  const {_id} = req.params
  try {
    const existEntrie = await db.collection("entries").findOne( new ObjectId(_id) );
    if(!existEntrie) return res.sendStatus(422)
    await db.collection("entries").deleteOne({_id: existEntrie._id})
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function editEntrie(req, res) {
  const { _id } = req.query;
  const {value, description, date} = req.body
  const {type} = req.params

  console.log(type)
	
  try {
    const existEntrie = await db.collection("entries").findOne( new ObjectId(_id) );
    if(!existEntrie) return res.sendStatus(422)
    let objectUpdate
    if(type==="output")
      objectUpdate = {...existEntrie, description, value: -Math.abs(parseFloat(value)),date}
    else
      objectUpdate = {...existEntrie, description, value: Math.abs(parseFloat(value)),date}


    await db.collection("entries").updateOne({ _id: existEntrie._id }, { $set: objectUpdate })
		res.sendStatus(200)
	 } catch (error) {
    console.log(error)
    res.status(500).send(error)
	 }
}