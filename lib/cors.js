/**
 * OPTIONS request need response with header "Access-Control-Allow-Methods".
 * The "Access-Control-Max-Age" is optional, but it can avoid unnecessary
 * OPTIONS request.
 *
 * And OPTIONS request have an empty body.
 */
function handleOPTIONS(ctx) {
  ctx.set("Access-Control-Allow-Methods", "HEAD, GET, PUT, DELETE, POST");
  ctx.set("Access-Control-Max-Age", 24 * 60 * 60);
  ctx.body = "";
}


/**
 * This function is a Koajs middleware, and `app.use(cors)` is the right way
 * to use it.
 */
async function cors(ctx, next) {
  //ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
  ctx.set("Access-Control-Allow-Origin", "*");

  /* When CORS request with a "Access-Control-Request-Headers" header,
   * you need to give back a "Access-Control-Allow-Headers"
   */
  if (ctx.headers["access-control-request-headers"])
    ctx.set("Access-Control-Allow-Headers", "content-type");

  /* When CORS with cookie, you need to set this header */
  ctx.set("Access-Control-Allow-Credentials", "true");

  if (ctx.method === "OPTIONS")
    handleOPTIONS(ctx);
  else
    await next();
}

module.exports = cors;
