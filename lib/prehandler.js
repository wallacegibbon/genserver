const logger = require("colourlogger").getLogger("genserver");


/** The server can be configured as NO LOG COLOR or even NO LOG. */
if (global.config.disableLogColor)
  logger.disableLogColor();


if (global.config.disableLog)
  logger.disableLog();



function getRequestIp(req) {
  if (req.headers.hasOwnProperty("x-forwarded-for"))
    return req.headers["x-forwarded-for"].split(",")[0];
  else
    return req.connection.remoteAddress;
}


async function prehandler(ctx, next) {
  ctx.logger = logger;

  const start = new Date();

  const clientIp = getRequestIp(ctx.req);
  logger.info(`Serving client [${clientIp}]...`);

  ctx.clientIp = clientIp;

  await next();

  ctx.set('X-Response-Time', `${new Date() - start}ms`);
}


module.exports = prehandler;

