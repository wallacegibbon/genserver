/**
 * Some gateway will treat 500 response in a unexpected way, so it's better
 * to return 200, and use the response JSON to represent error info.
 *
 * You should always use this as the first Koa middleware.
 */
async function handler(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.body = JSON.stringify({ error: e.message });
    //ctx.status = 500;
    ctx.app.emit("error", e, ctx);
  }
}

module.exports = handler;
