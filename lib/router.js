const { handleAction } = require("./action");
const { inspect } = require("util");
const url = require("url");


/**
 * List of pairs ==> object. e.g. [[ "a", 1 ], [ "b", 2 ]] ==> { a: 1, b: 2 }
 */
function makeObject(pairs) {
  const newPairs = pairs.map(([ k, v ]) => { return { [k.trim()]: v.trim() }});
  return Object.assign(...newPairs);
}


/**
 * Parse query and return it as an object. e.g. "a=1&b=2" ==> { a: 1, b: 2 }
 */
function getArguments(query) {
  if (query)
    return makeObject(decodeURI(query).split("&").map(x => x.split("=")));
  else
    return {};
}


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
  const { pathname, query } = url.parse(ctx.req.url);
  const { cmd, ...args } = getArguments(query);
  if (!cmd)
    throw new Error(`Argument 'cmd' not found`);

  const actionName = getActionName(pathname);

  ctx.logger.info(`Calling ${actionName}.${cmd}(${inspect(args)})`);
  const r = await handleAction(actionName, cmd, args);

  ctx.body = JSON.stringify(r);

  await next();
}


module.exports = router;

