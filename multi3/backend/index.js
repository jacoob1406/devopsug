const keys = require("./keys");
const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
const getDay = require("date-fns/getDay");

const getDayOfWeek = (date) => {
  return getDay(new Date(date));
};

const app = express();
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
  .catch((err) => console.log(err));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

app.get("/", (request, response) => {
  response.send("Hello from backend");
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
      pgClient
        .query("INSERT INTO values (number) VALUES ('" + countedDay + "');")
        .catch((pgError) => console.log(pgError));
      redisClient.set(date, countedDay);
      response.send(countedDay.toString());
    } else {
      response.send(cachedDay.toString());
    }
  });
});

const port = 5000;

app.listen(port, (err) => {
  console.log(`Backend listening on port ${port}`);
  console.log(keys);
});
