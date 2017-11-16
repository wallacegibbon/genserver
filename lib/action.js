const { readdirSync } = require("fs");


/**
 * User configured action path comes from the global configuration. The path is
 * a relative path like "./actions".
 */
const actionPath = global.config.actionPath;



/**
 * Load action from user's action path. This is a simple wrapper for "require"
 * function in Node.js.
 */
function loadAction(actionName) {
  try {
    return require(`${process.cwd()}/${actionPath}/${actionName}`);
  } catch (e) {
    throw new Error(`Load '${actionName}' error: ${e}`);
  }
}


/**
 * Load all user action at once. So that next time you require the action, it
 * will be already in the cache.
 */
function preloadActions() {
  const pathPrefix = `${process.cwd()}/${actionPath}`;
  readdirSync(actionPath).forEach(x => require(`${pathPrefix}/${x}`));
}


/**
 * Call the cmd of a action. args is an object that will be passed to cmd.
 */
async function handleAction(name, cmd, args) {
  const action = loadAction(name);

  if (typeof action[cmd] !== "function")
    throw new Error(`Action cmd ${cmd} not found.`);
  else
    return await action[cmd](args);
}


module.exports = {
  handleAction,
  preloadActions,
};
