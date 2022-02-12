import express from "express";
import { PrismaClient } from "@prisma/client";

import { config } from "./config";

const app = express();
const { port } = config;
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  try {
    const allusers = await prisma.user.findMany();
    console.log({ allusers });
    res.status(200).send({ message: "OK" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
