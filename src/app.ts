import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { History } from "src/types/history";

dotenv.config();

const app = express();
const fs = require("fs/promises");
const port = process.env.PORT ?? 3001;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/howmany", async (req, res) => {
  const logs = JSON.parse(
    await fs.readFile(__dirname + "/log.txt").toString()
  ) as History[];
  res.send({ cnt: logs[logs.length - 1].cnt });
});

app.get("/api/lastupdate", async (req, res) => {
  const logs = JSON.parse(
    await fs.readFile(__dirname + "/log.txt").toString()
  ) as History[];
  res.send({ update: logs[logs.length - 1].update });
});

app.post("/api/history", async (req, res) => {
  const logs = JSON.parse(
    await fs.readFile(__dirname + "/log.txt").toString()
  ) as History[];

  const history: History = {
    cnt: req.body.cnt,
    update: new Date(),
  };

  logs.push(history);

  await fs.writeFile(__dirname + "/log.txt", JSON.stringify(logs));

  res.send(201);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
