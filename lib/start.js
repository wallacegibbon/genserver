#! /usr/bin/env node

const fs = require("fs");
const version = require("../package.json").version;


/**
 * Print all configurations. This should be called after function loadConfig.
 */
function printStartupInfo() {
  console.log(`Starting genserver@${version} with following configurations:`);
  Object.entries(global.config)
    .forEach(([k, v]) => console.log(`${k.padEnd(30)}${v}`));
}



/**
 * Load configuration from JSON file and assign it to a global variable.
 */
function loadConfig(fileName) {
  const configFile = `${process.cwd()}/${fileName}`;
  const userConfig = fs.existsSync(configFile) ? require(configFile) : {};
  const defaultConfig = { actionPath: `./actions`, port: 8000 };
  const config = Object.assign(defaultConfig, userConfig);

  global.config = config;
}


/**
 * Supported usage: `genserver --version` or `genserver nondefault.json`
 */
function parseArgument() {
  const [ _a, _b, arg ] = process.argv;
  if (arg === "--version" || arg === "-v")
    printAndExit(version);

  if (arg === undefined)
    return loadConfig("genserver.json");

  if (arg.endsWith(".json"))
    return loadConfig(arg);

  printAndExit("Usage: genserver [genserverconfig.json]");
}


function printAndExit(info) {
  console.log(info);
  process.exit(0);
}



parseArgument();

if (!global.config.disableLog)
  printStartupInfo();

require("./httpd").listen(config.port);

