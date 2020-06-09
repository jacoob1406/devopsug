const redis = require("redis");
const getDay = require("date-fns/getDay");
const express = require("express");

const { v4: uuidv4 } = require("uuid");

const appId = uuidv4();

const port = 5000;

const getDayOfWeek = (date) => {
  return getDay(new Date(date));
};

const app = express();

const { Pool } = require("pg");
const pgClient = new Pool({
  host: "postgres-service",
  port: 5432,
  user: "postgres",
  password: "pgpassword123",
  database: "postgres",
});

pgClient.on("error", () => console.log("Cannot connect to PG database"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT);")
  .catch((err) => console.log(err));

const redisClient = redis.createClient({
  host: "redis-service",
  port: 6379,
  retry_strategy: () => 1000,
});

app.get("/", (request, response) => {
  response.send(`[${appId}] Hello from my backend app`);
});

// app.get("/days/values", (request, response) => {
//   pgClient.query("SELECT * FROM values;", (pgError, queryResult) => {
//     if (!queryResult || !queryResult.rows) {
//       response.json([]);
//     } else {
//       response.send(`[${appId}] Hello from my backend app
//       <br/>Days of week: ${JSON.stringify(queryResult.rows)}`);
//       // response.json(queryResult.rows);
//     }
//   });
// });

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
      response.send(`From cache: ${cachedDay.toString()}`);
    }
  });
});

app.listen(port, (err) => {
  console.log(`Backend listening on port ${port}`);
});
