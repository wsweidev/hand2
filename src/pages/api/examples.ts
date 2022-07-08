// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@src/server/db/client";

const exampleEndPoint = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ examples: "3" });
};

export default exampleEndPoint;
