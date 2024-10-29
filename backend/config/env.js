// config/env.js
const { cleanEnv, str, port } = require('envalid');

const env = cleanEnv(process.env, {
    MONGO_URI: str(),
    JWT_SECRET: str(),
    PORT: port({ default: 5000 }),
});

module.exports = env;
