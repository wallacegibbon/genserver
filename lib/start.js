#! /usr/bin/env node

const fs = require("fs");

const configFile = `${process.cwd()}/genserver.json`;
const userConfig = fs.existsSync(configFile) ? require(configFile) : {};

const defaultConfig = { actionPath: `./actions`, port: 8000 };
const config = Object.assign(defaultConfig, userConfig);

global.config = config;


if (!config.disableLog)
  Object.entries(config).forEach(([k, v]) => console.log(`${k}=${v}`));


require("./httpd").listen(config.port);

