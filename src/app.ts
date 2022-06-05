import express from "express";
import { logs } from "./logs/log";

const app = express();
const port = process.env.PORT ?? 3001;

app.get("/api/howmany", (req, res) => {
  res.send({ cnt: logs[logs.length - 1].cnt });
});

app.get("/api/lastupdate", (req, res) => {
  res.send({ update: logs[logs.length - 1].update });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
