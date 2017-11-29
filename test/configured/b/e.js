function errorHandler(e, ctx) {
  if (ctx.query.cmd)
    return `${e.message} (${ctx.query.cmd}) ;)`;
  else
    return null;
}


module.exports = errorHandler;

