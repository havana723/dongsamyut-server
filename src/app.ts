import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { History } from "src/types/history";
import config from "./config";

const app = express();

const { expressjwt } = require("express-jwt");
const fs = require("fs/promises");
const jwt = require('jsonwebtoken');
const port = process.env.PORT ?? 3001;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/howmany", async (req, res) => {
  const logs = JSON.parse(
    await fs.readFile(__dirname + "/log.txt", "utf8")
  ) as History[];
  res.send({ cnt: logs[logs.length - 1].cnt });
});

app.get("/api/lastupdate", async (req, res) => {
  const logs = JSON.parse(
    await fs.readFile(__dirname + "/log.txt", "utf8")
  ) as History[];
  res.send({ update: logs[logs.length - 1].update });
});

app.get("/api/auth", async (req, res) => {
  const clientRemoteIP = req.headers["X-Forwarded-For"] ?? req.ip;

  if (clientRemoteIP === config.dongbangIPAddress) {
    res.send({
      token: jwt.sign({ kuaaa: 'kuaaa' }, config.jwtSecret),
    });
  } else {
    res.sendStatus(401);
  }

});

app.post("/api/history",
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS256"] }),
  async (req, res) => {
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
