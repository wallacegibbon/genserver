function errorHandler(e, ctx) {
  const i = `[${e.name}]<${ctx.query.cmd}>${e.message}`;
  ctx.logger.error(`[${ctx.clientIp}]${i}`);
  //return 1; //Sometimes you need use number to represent error type.
  return i;
}


module.exports = errorHandler;

