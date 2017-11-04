# Generic Purposed JSON API Server


## Quick Start

Before using genserver, you need to install it first. The installation process
is simple, only 2 parts:
1. Install Node.js (>= version 8).
2. Install genserver as global package: npm install -g genserver

Now you can use it. In the following example, all commands are supposed to be executed in a Linux/MacOS terminal.


1. Swith to an empty directory, create a directory named "actions". You can simply run the following commands:

```sh
mkdir /tmp/testgenserver
cd /tmp/testgenserver
mkdir actions
```

2. Create a Javascript file(in this example, it's blah.js) in directory "actions". Then let's write a simple function "blah" and exports it.

```sh
cat > actions/blah.js << EOF

function blah(args) {
  return Object.assign(args, { "info": "Wow, this is so simple!" });
}

module.exports = {
  blah,
}

EOF
```

3. Start the server

```sh
genserver
```

4. Open the link in browser: http://localhost:8000/blah?cmd=blah&a=b


You can change the query argument to see the result.


The function you write can be `async` function, you can see `test/a/actions/playasync.js` for more details.


## Configuration

### TCP Port
If you don't want the default configuration, for example, you want to change the tcp port to be listened, you can create your own configuration file to overwrite the default configuration. The file name has to be `genconfig.json`.

Let's just use the example above, you need to create a `genconfig.json` in the project directory, in this example, it's "/tmp/testgenserver", so let's write this to `/tmp/testgenserver/genconfig.json`:

```json
{
  "port": 9000
}
```

Then restart the server, it will listen port 9000 instead of 8000 now. Check it out: http://localhost:9000/blah?cmd=blah&a=b


### Action Path

By default, the action path is "actions", you can change it through `genconfig.json`.

```json
{
  "port": 9000,
  "actionPath": "./myactions"
}
```


Have fun !

