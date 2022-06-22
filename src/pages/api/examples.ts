// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const exampleEndPoint = async (req: NextApiRequest, res: NextApiResponse) => {
    const examples = await prisma.example.findMany();
    res.status(200).json(examples);
};

export default exampleEndPoint;
