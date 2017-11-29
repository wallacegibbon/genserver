function errorHandler(e, ctx) {
  return `${e.message} (${ctx.query.cmd}) ;)`;
}


module.exports = errorHandler;

