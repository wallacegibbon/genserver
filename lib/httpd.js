const errorhandler = require("./errorhandler");
const prehandler = require("./prehandler");
const router = require("./router");
const logger = require("./logger");
const cors = require("./cors");

const Koa = require("koa");

const app = new Koa();

app.use(errorhandler);
app.use(prehandler);
app.use(cors);
app.use(router);

app.on('error', logger.error);

module.exports = app;

