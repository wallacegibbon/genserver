const { readdirSync } = require("fs");
const { inspect } = require("util");
const logger = require("lvlog");


const actionPath = global.config.actionPath;


const builtinActions = {
  builtin: { echo: x => x }
};


/**
 * Load all user action at once. So that next time you require the action, it
 * will be already in the cache.
 */
function preloadActions() {
  if (actionPath)
    readdirSync(actionPath).forEach(x => require(`${actionPath}/${x}`));
  else
    logger.warn("USERACTIONPATH not found, no external action loaded");
}


/**
 * Load action from user's action path. This is a simple wrapper for "require"
 * function in Node.js.
 */
function loadAction(actionName) {
  if (actionName !== "builtin") {
    try {
      return require(`${actionPath}/${actionName}`);
    } catch (e) {
      logger.error(`require("${actionPath}/${actionName}") failed`);
      throw new Error(`Failed finding action '${actionName}'.`);
    }
  } else {
    return builtinActions;
  }
}


/**
 * Call the cmd of a action. args is an object that will be passed to cmd.
 */
function handleAction(name, cmd, args) {
  logger.info(`Calling ${name}.${cmd} with arguments: ${inspect(args)}`);

  const action = loadAction(name);

  if (typeof action[cmd] !== "function")
    throw new Error(`action ${name} support ${Object.keys(action)} only`);
  else
    return action[cmd](args);
}


module.exports = {
  handleAction,
  preloadActions,
};
