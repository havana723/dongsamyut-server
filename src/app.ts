import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { History } from "src/types/history";

dotenv.config();

const app = express();
const fs = require("fs");
const port = process.env.PORT ?? 3001;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/howmany", (req, res) => {
  const logs = JSON.parse(
    fs.readFileSync(__dirname + "/log.txt").toString()
  ) as unknown as History[];
  res.send({ cnt: logs[logs.length - 1].cnt });
});

app.get("/api/lastupdate", (req, res) => {
  const logs = JSON.parse(
    fs.readFileSync(__dirname + "/log.txt").toString()
  ) as unknown as History[];
  res.send({ update: logs[logs.length - 1].update });
});

app.post("/api/history", (req, res) => {
  const logs = JSON.parse(
    fs.readFileSync(__dirname + "/log.txt").toString()
  ) as unknown as History[];

  const history: History = {
    cnt: req.body.cnt,
    update: new Date(),
  };

  logs.push(history);

  fs.writeFileSync(__dirname + "/log.txt", JSON.stringify(logs));

  res.send(201);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
