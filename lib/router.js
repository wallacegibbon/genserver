const { handleAction } = require("./action");
const url = require("url");


/**
 * List of pairs ==> object. e.g. [[ "a", 1 ], [ "b", 2 ]] ==> { a: 1, b: 2 }
 */
function makeObject(pairs) {
  const newPairs = pairs.map(([ k, v ]) => { return { [k]: v }});
  return Object.assign({}, ...newPairs);
}


/**
 * Parse query and return it as an object. e.g. "a=1&b=2" ==> { a: 1, b: 2 }
 */
function getArguments(query) {
  if (query)
    return makeObject(query.split("&").map(x => x.split("=")));
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
 * The router dispatcher. The result of this function will be returned to
 * client directly.
 */
async function dispatch(pathname, args) {
  const { cmd, ...realArgs } = args;
  if (!cmd)
    throw new Error(`Argument 'cmd' not found`);

  return await handleAction(getActionName(pathname), cmd, realArgs);
}


/**
 * The Koa middleware to be exported.
 */
async function router(ctx, next) {
  const { pathname, query } = url.parse(ctx.req.url);

  const r = await dispatch(pathname, getArguments(query));
  ctx.body = (typeof r !== "string") ? JSON.stringify(r) : r;

  await next();
}


module.exports = router;

