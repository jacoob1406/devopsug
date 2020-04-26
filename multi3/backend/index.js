const keys = require("./keys");
const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");

console.log(keys);

const countGcd = (a, b) => {
  if (b) {
    return countGcd(b, a % b);
  } else {
    return Math.abs(a);
  }
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
  .query("CREATE TABLE IF NOT EXISTS gcd_values (number INT);")
  .catch((err) => console.log(err));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

app.get("/", (request, response) => {
  response.send("Hello from backend");
});

app.get("/gcd/values", (request, response) => {
  pgClient.query("SELECT * FROM gcd_values;", (pgError, queryResult) => {
    response.send(queryResult.rows);
  });
});

app.get("/gcd/:num1/:num2", (request, response) => {
  const num1 = parseInt(request.params.num1);
  const num2 = parseInt(request.params.num2);
  const dbGcd = [num1, num2].sort((a, b) => a - b).toString();

  redisClient.get(dbGcd, (err, cachedGcd) => {
    if (!cachedGcd) {
      const countedGcd = countGcd(num1, num2);
      pgClient
        .query("INSERT INTO gcd_values (number) VALUES ('" + countedGcd + "');")
        .catch((pgError) => console.log(pgError));
      redisClient.set(dbGcd, countedGcd);
      response.send(`gcd(${num1},${num2}) = ${countedGcd}`);
    } else {
      response.send(`from cache: gcd(${num1},${num2}) = ${cachedGcd}`);
    }
  });
});

const port = 5000;

app.listen(port, (err) => {
  console.log(`Backend listening on port ${port}`);
});
