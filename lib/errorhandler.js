const { UserErrorHandlerError } = require("./errors");


/**
 * The user defined error handler should be loaded at startup. Because it not
 * supposed to change configuration at runtime, and this may raise exceptions.
 */
var userHandler = null;

if (global.config.errorHandler) {
  try {
    userHandler = require(`${process.cwd()}/${global.config.errorHandler}`);
  } catch (e) {
    throw new UserErrorHandlerError("Failed loading user error handler");
  }
}



/**
 * Some gateway will treat 500 response in a unexpected way, so it's better
 * to return 200, and use the response JSON to represent error info.
 *
 * You should always use this as the first Koa middleware.
 */
function errorDispatcher(ctx, e) {
  ctx.logger.error(`[${ctx.clientIp}][${e.name}] ${e.message}`);
  ctx.set('Content-Type', 'application/json');
  ctx.app.emit("error", e, ctx);

  const errInfo = userHandler ? userHandler(e) : `[${e.name}] ${e.message}`;

  ctx.body = JSON.stringify({ error: errInfo });
}


/**
 * The Koa middleware to be exported.
 */
async function handler(ctx, next) {
  try {
    await next();
  } catch (e) {
    errorDispatcher(ctx, e);
  }
}


module.exports = handler;
