#! /usr/bin/env node

const fs = require("fs");
const version = require("../package.json").version;


const configFile = `${process.cwd()}/genserver.json`;
const userConfig = fs.existsSync(configFile) ? require(configFile) : {};

const defaultConfig = { actionPath: `./actions`, port: 8000 };
const config = Object.assign(defaultConfig, userConfig);

global.config = config;


function printStartupInfo() {
  console.log(`Starting genserver@${version} with configurations:`);
  Object.entries(config)
    .forEach(([k, v]) => console.log(`${k.padEnd(30)}${v}`));
}


if (!config.disableLog)
  printStartupInfo();


require("./httpd").listen(config.port);

