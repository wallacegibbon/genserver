const { handleAction } = require("./action");
const url = require("url");


/* Get needed configuration from global config */
const urlFirstField = global.config.urlFirstField;



/**
 * List of pairs ==> object. e.g. [[ "a", 1 ], [ "b", 2 ]] ==> { a: 1, b: 2 }
 */
function makeObject(pairs) {
  const newPairs = pairs.map(([ k, v ]) => { return { [k]: v }});
  return Object.assign({}, ...newPairs);
}


/**
 * Parse query and return an object. e.g. "a=1&b=2" ==> { a: 1, b: 2 }
 */
function getArguments(query) {
  if (query)
    return makeObject(query.split("&").map(x => x.split("=")));
  else
    return {};
}


/**
 * Return the 1st field of a pathname. e.g. "/index/home/x" ==> "index"
 */
function get1stField(pathname) {
  const r = /^\/([^\/]*)/.exec(pathname);
  if (!r)
    throw new Error(`1st field of pathname wrong: '${pathname}'`);
  else
    return r[1];
}


/**
 * Return the 2nd field of a pathname. e.g. "/index/home/x" ==> "home"
 */
function get2ndField(pathname) {
  const r = /^\/[^\/]*\/([^\/]*)/.exec(pathname);
  if (!r)
    throw new Error(`2nd field of pathname wrong: '${pathname}'`);
  else
    return r[1];
}


/**
 * This is a pure API server, all unrelated request is treated as error.
 */
function handleOthers(pathname) {
  throw new Error(`unsupported pathname: '${pathname}'`);
}


/**
 * The router dispatcher. The result of this function will be returned to
 * client directly.
 */
function dispatch(pathname, args) {
  const { cmd, ...realArgs } = args;
  if (!cmd)
    throw new Error(`Can't find argument 'cmd' in query string`);

  if (!urlFirstField) {
    return handleAction(get1stField(pathname), cmd, realArgs);
  }

  switch (get1stField(pathname)) {
  case urlFirstField:
    return handleAction(get2ndField(pathname), cmd, realArgs);

  default:
    return handleOthers(pathname);
  }
}


/**
 * The Koa middleware to be exported.
 */
async function router(ctx, next) {
  const { pathname, query } = url.parse(ctx.req.url);
  const r = dispatch(pathname, getArguments(query));

  if (typeof r !== "string")
    ctx.body = JSON.stringify(r);
  else
    ctx.body = r;

  await next();
}

module.exports = router;

