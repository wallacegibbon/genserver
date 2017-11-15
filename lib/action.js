const { readdirSync } = require("fs");
const { inspect } = require("util");
const logger = require("colourlogger").getLogger("genserver");


const actionPath = global.config.actionPath;


/**
 * Load action from user's action path. This is a simple wrapper for "require"
 * function in Node.js.
 */
function loadAction(actionName) {
  const actionFullPath = `${process.cwd()}/${actionPath}/${actionName}`;
  try {
    logger.trace(`Calling require("${actionFullPath}")...`);
    return require(actionFullPath);
  } catch (e) {
    throw new Error(`Action '${actionName}' not ready`);
  }
}


/**
 * Load all user action at once. So that next time you require the action, it
 * will be already in the cache.
 */
function preloadActions() {
  try {
    readdirSync(actionPath).forEach(x => require(`${actionPath}/${x}`));
  } catch (e) {
    logger.error(`Preload actions failed: ${e}`);
  }
}


/**
 * Call the cmd of a action. args is an object that will be passed to cmd.
 */
async function handleAction(name, cmd, args) {
  logger.info(`Calling ${name}.${cmd} with arguments: ${inspect(args)}`);

  const action = loadAction(name);

  if (typeof action[cmd] !== "function")
    throw new Error(`Action ${name} supports ${Object.keys(action)}`);
  else
    return await action[cmd](args);
}


module.exports = {
  handleAction,
  preloadActions,
};
