const logger = require("./logger");


function getRequestIp(req) {
  if (req.headers.hasOwnProperty("x-forwarded-for"))
    return req.headers["x-forwarded-for"].split(",")[0];
  else
    return req.connection.remoteAddress;
}


async function prehandler(ctx, next) {
  ctx.set('Content-Type', 'application/json');

  const start = new Date();

  const clientIp = getRequestIp(ctx.req);
  logger.info(`Serving client [${clientIp}]...`);

  ctx.clientIp = clientIp;

  await next();

  ctx.set('X-Response-Time', `${new Date() - start}ms`);
}


module.exports = prehandler;

