module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgHost: process.env.PGHOST,
    pgPort: process.env.PGPORT,
    pgUser: process.env.PGUSER,
    pgPassword: process.env.PGPASSWORD.trim(),
    pgDatabase: process.env.PGDATABASE,
}