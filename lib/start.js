#! /usr/bin/env node


const { existsSync } = require("fs");


const currentRunningDir = process.cwd();

const userConfigFile = `${currentRunningDir}/genserver.json`;
const userConfig = existsSync(userConfigFile) ? require(userConfigFile) : {};

const defaultConfig = { actionPath: `./actions`, port: 8000 };
const config = Object.assign(defaultConfig, userConfig);


/* print the configuration at startup */
console.log("".padStart(75, "="), "\nServer current configurations:");
Object.entries(config).forEach(([k, v]) => console.log(`${k}="${v}"`));


/* passing configurations to server through global variable */
global.config = config;


console.log(`Will listen on port ${config.port}...`);

/* Start the http server */
require("./httpd").listen(config.port);

