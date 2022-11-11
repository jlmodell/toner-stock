// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../src/utils/db";
import { tonerSchema, Toner } from "../../../../../src/utils/types/toner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Toner | string>
) {
  const { id } = req.query;
  if (id !== req.body.id) {
    res.status(400).json("ID in URL and body do not match");
    return;
  }

  if (req.method === "PUT") {
    const toner = req.body as Toner;
    if (!(await CheckIfTonerExists(toner.id))) {
      res.status(404).json("Toner not found");
      return;
    }

    await UpdateTonerInDatabase(toner);

    res.status(200).json(toner);
    return;
  }

  res
    .status(400)
    .send(
      "This route only accepts post requests with a toner object in the body"
    );
}

async function CheckIfTonerExists(id: string) {
  const client = await clientPromise;
  const db = client.db("toner-stock");
  const collection = db.collection("toners");

  const result = await collection.findOne({ id: id });

  if (result) {
    return true;
  }

  return false;
}

async function UpdateTonerInDatabase(toner: Toner) {
  const client = await clientPromise;
  const db = client.db("toner-stock");
  const collection = db.collection("toners");

  const validate = tonerSchema.safeParse(toner);

  if (!validate.success) {
    console.log(validate.error);
    return;
  }

  const result = await collection.updateOne({ id: toner.id }, { $set: toner });

  console.log(result);
}
