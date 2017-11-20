const { UserMiddlewareError } = require("./errors");


function loadUserMiddleware() {
  try {
    return require(`${process.cwd()}/${global.config.userMiddleware}`);
  } catch (e) {
    throw new UserMiddlewareError("Failed loading user middleware");
  }
}


async function emptyUserMiddleware(ctx, next) {
  await next();
}


if (global.config.userMiddleware)
  module.exports = loadUserMiddleware();
else
  module.exports = emptyUserMiddleware;

