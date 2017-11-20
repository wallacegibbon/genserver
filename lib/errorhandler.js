/**
 * Some gateway will treat 500 response in a unexpected way, so it's better
 * to return 200, and use the response JSON to represent error info.
 *
 * You should always use this as the first Koa middleware.
 */
function errorHandler(ctx, e) {
  ctx.logger.error(`[${ctx.host}][${e.name}] ${e.message}`);
  ctx.set('Content-Type', 'application/json');
  ctx.app.emit("error", e, ctx);

  ctx.body = JSON.stringify({ error: `[${e.name}] ${e.message}` });
}


async function handler(ctx, next) {
  try {
    await next();
  } catch (e) {
    errorHandler(ctx, e);
  }
}


module.exports = handler;
