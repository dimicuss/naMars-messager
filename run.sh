#!/bin/bash


export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/dimicuss/phpStorm/bin
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript

forever start $HOME/naMars-messenger/server.js

exit 0
