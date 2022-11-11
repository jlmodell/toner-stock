// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../src/utils/db";
import { tonerSchema, Toner } from "../../../../src/utils/types/toner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Toner[] | Toner | string>
) {
  const { id } = req.query;

  const client = await clientPromise;
  const db = client.db("toner-stock");
  const collection = db.collection("toners");
  if (req.method === "GET") {
    if (id === "all") {
      const getToners = await collection.find({}).toArray();

      const toners = getToners.map((toner) => {
        return tonerSchema.parse(toner);
      });

      res.status(200).json(toners);
      return;
    }

    const getToner = await collection.findOne({ id: id });

    if (!getToner) {
      res.status(404).json("Toner not found");
      return;
    }

    const toner = tonerSchema.parse(getToner);

    res.status(200).json(toner);
    return;
  }

  res.status(400).send("This route only accepts get requests");
}
