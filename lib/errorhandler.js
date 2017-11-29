const { UserErrorHandlerError } = require("./errors");


/**
 * The user defined error handler should be loaded at startup. Because it not
 * supposed to change configuration at runtime, and this may raise exceptions.
 */
const userHandler = getUserErrorHandler();


function getUserErrorHandler() {
  if (global.config.errorHandler) {
    try {
      return require(`${process.cwd()}/${global.config.errorHandler}`);
    } catch (e) {
      throw new UserErrorHandlerError("Failed loading user error handler");
    }
  } else {
    return null;
  }
}


/**
 * Some gateway will treat 500 response in a unexpected way, so it's better
 * to return 200, and use the response JSON to represent error info.
 *
 * You should always use this as the first Koa middleware.
 */
function errorDispatcher(ctx, e) {
  const errInfo = userHandler ? userHandler(e) : `[${e.name}] ${e.message}`;
  ctx.logger.error(`[${ctx.clientIp}]${errInfo}`);
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ error: errInfo });

  if (global.config.emitError)
    ctx.app.emit("error", e, ctx);
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
