
//  std libs
var net = require('net'),
    events = require('events');

// lib libs
var Client = require('./client'),
    Protocol = require('./protocol');


function Server () {
    
    this.settings = {
        
        hostname: 'ryan-server'
        
    };
    
    // init net.server instance
    this.server = new net.Server;
    
    // init message parser
    this.protocol = new Protocol(this);
    
    // set event handlers
    this.server.on('error', this.onError.bind(this));
    this.server.on('connection', this.onConnection.bind(this));
    
};

Server.prototype.listen = function (port) {
    
    this.server.listen(port);
    
};

Server.prototype.onConnection = function (socket) {
    
    // init client instance
    var client = new Client(socket);
    
    // set event handlers
    client.on('data', this.onClientData.bind(this));
    
};

Server.prototype.onError = function (error) {
    
    console.log(error);
    
};

Server.prototype.onClientData = function (client, data) {
    
    var parsedMessage = {
        
        client: client
        
    };
    
    // split on the obvious delimiter
    var parts = data.split(' ');
    
    // handle messages with and without prefix
    if (parts[0][0] == ':') {
        
        parsedMessage.prefix = parts.shift();
        parsedMessage.command = parts.shift().toUpperCase();
        
    } else {
        
        parsedMessage.command = parts.shift().toUpperCase();
        
    }
    
    // tack on message params
    parsedMessage.params = parts.join(' ');
    
    // handle the received message
    this.protocol.handleMessage(parsedMessage);
    
};

// export server object
module.exports = Server;
