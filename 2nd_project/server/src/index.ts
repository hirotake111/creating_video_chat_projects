import express from "express";

import { config } from "./config";

const app = express();
const { port } = config;
app.get("/", (req, res) => {
  res.status(200).send({ message: "OK" });
});

app.listen(port, () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
