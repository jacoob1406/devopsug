const express = require("express");
const redis = require("redis");
const process = require("process");

const app = express();

const client = redis.createClient({
    host: 'my-redis-server',
    port: 6379,
});

client.set('counter', 0);

app.get('/', (req, res) => {

    process.exit(0); 

    client.get('counter', (err, counterValue) => {
        res.send('Counter: ' + counterValue);
        client.set('counter', parseInt(counterValue) + 1);
    });
});

const nwd = (a, b) => {
    if (!b) {
      return a;
    }
    return nwd(b, a % b);
  }

  app.get("/nwd/:num1/:num2", (req, res) => {
	const num1 = req.params.num1;
	const num2 = req.params.num2;
	const key = `${num1}:${num2}`;

	client.get(key, (err, value) => {
		if (!value) {
			value = nwd(num1, num2);
		}
		res.send(`Greatest common divisor of ${num1} and ${num2} is ${value}`);
		client.set(key, parseInt(value));
	});
});

app.listen(8080, () => {
    console.log("Listening on port 8080")
});