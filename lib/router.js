const { handleAction } = require("./action");
const { inspect } = require("util");


/**
 * Return the last field of a pathname. e.g. "/a/b/c/d/aname" ==> "aname"
 */
function getActionName(pathname) {
  const fields = pathname.split(/\/+/);
  const actionName = fields[fields.length - 1] || fields[fields.length - 2];
  if (!actionName)
    throw new Error(`No action name in URL '${pathname}'`);

  return actionName;
}


/**
 * The Koa middleware to be exported.
 */
async function router(ctx, next) {
  const { cmd, ...args } = ctx.query;
  if (!cmd)
    throw new Error(`Argument 'cmd' not found`);

  const actionName = getActionName(ctx.path);

  ctx.logger.info(`Calling ${actionName}.${cmd}(${inspect(args)})`);

  const r = await handleAction(actionName, cmd, args);

  ctx.body = JSON.stringify(r);

  await next();
}


module.exports = router;

