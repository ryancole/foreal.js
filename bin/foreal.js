#!/usr/bin/env node

var server = new (require('../src/server'));

server.listen(6667);