const { FilterError } = require("./errors");


/**
 * The user defined filter should be loaded at start up. A Koa middleware is
 * supposed to be exported by the filter file.
 */
var userFilter = null;

if (global.config.filter) {
  try {
    userFilter = require(`${process.cwd()}/${global.config.filter}`);
  } catch (e) {
    throw new FilterError("Failed loading user filter");
  }
}


/**
 * When user filter is not specified, use the default filter.
 */
async function emptyFilter(ctx, next) {
  await next();
}


module.exports = userFilter ? userFilter : emptyFilter;

