const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((err) => console.log(err));

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
});

app.get("/gcd/:num1/:num2", (req, res) => {
  const key = `GCD(${req.query.num1},${req.query.num2})`;
  client.get(key, (err, value) => {
    if (!value) {
      console.log("GCD not found in cache");
      const gcd = gcd(parseInt(req.query.num1), parseInt(req.query.num2));
      client.set(key, parseInt(gcd));
      const query = `INSERT INTO values(number) VALUES (${gcd})`;
      pgClient.query(query);
      res.send({ gcd });
    } else {
      console.log("GCD from CACHE");
      res.send({ gcd: value });
    }
  });
});

app.get("/gcd/values", (req, res) => {
  const result = pgClient.query("SELECT * FROM values");
  res.send({ gcd: result.rows });
});

const gcd = (a, b) => {
    if (b) {
        return gcd(b, a % b);
      } else {
        return Math.abs(a);
      }
  }

app.listen(5000, () => {
  console.log("Backend listening");
});
