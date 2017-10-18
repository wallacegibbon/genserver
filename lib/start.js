#! /usr/bin/env node


const { existsSync } = require("fs");

const defaultConfig = require("./config.json");

const currentRunningDir = process.cwd();
/* Fix action path */
defaultConfig.actionPath = `${currentRunningDir}/actions`;


const userConfigFileName = "genserver.json";

/* load user specific configuration */
const userConfigFile = `${currentRunningDir}/${userConfigFileName}`;
const userConfig = existsSync(userConfigFile) ? require(userConfigFile) : {};

const config = Object.assign({}, defaultConfig, userConfig);


/* print the configuration at startup */
console.log("".padStart(75, "="), "\nServer current configurations:");
Object.entries(config).forEach(([k, v]) => console.log(`${k}="${v}"`));


/* passing configurations to server through global variable */
global.config = config;


console.log(`Will listen on port ${config.port}...`);


/* Start the http server */
require("./httpd").listen(config.port);

