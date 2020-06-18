const keys = require("./keys");
const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
const getDay = require("date-fns/getDay");
const { v4: uuidv4 } = require("uuid");

const getDayOfWeek = (date) => {
  return getDay(new Date(date));
};

const app = express();
const appId = uuidv4();
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require("pg");
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
});

pgClient.on("error", () => console.log("Cannot connect to PG database"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT);")
  .catch((err) => console.log(err))
  .then(() => console.log("PG table initialized"));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

app.get("/", (request, response) => {
  response.send(`[${appId}] Hello from my backend app`);
});

app.get("/days/values", (request, response) => {
  pgClient.query("SELECT * FROM values;", (pgError, queryResult) => {
    if (!queryResult.rows) {
      response.json([]);
    } else {
      response.json(queryResult.rows);
    }
  });
});

app.get("/days/:date", (request, response) => {
  const date = request.params.date;
  redisClient.get(date, (err, cachedDay) => {
    if (!cachedDay) {
      const countedDay = getDayOfWeek(date);
      pgClient.query(
        `INSERT INTO values (number) VALUES (${countedDay})`,
        (err) => console.log(err)
      );
      redisClient.set(date, countedDay);
      response.send(countedDay.toString());
    } else {
      response.send(`From cache: ${cachedDay.toString()}`);
    }
  });
});

const port = 5000;

app.listen(port, (err) => {
  console.log(`Backend listening on port ${port}`);
});
