
//  std libs
var net = require('net'),
    events = require('events');

// lib libs
var Client = require('./client'),
    ErrorHandler = require('./error'),
    MessageHandler = require('./message');


function Server () {
    
    this.settings = {
        
        hostname: 'ryan-server'
        
    };
    
    // init net.server instance
    this.server = new net.Server;
    
    // init irc message handler
    this.messageHandler = new MessageHandler(this);
    this.errorHandler = new ErrorHandler(this);
    
    // collection of connected clients
    this.clients = [];
    
    // set event handlers
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
    
    // add client to collection
    this.clients.push(client);
    
};

Server.prototype.onClientData = function (client, data) {
    
    var parsedMessage = {
        
        client: client
        
    };
    
    // split on the obvious delimiter
    var parts = data.trim().split(' ');
    
    // handle messages with and without prefix
    if (parts[0][0] == ':') {
        
        parsedMessage.prefix = parts.shift();
        parsedMessage.command = parts.shift().toUpperCase();
        
    } else {
        
        parsedMessage.command = parts.shift().toUpperCase();
        
    }
    
    // tack on message params
    parsedMessage.params = parts;
    
    // handle the received message
    var error = this.messageHandler.handleMessage(parsedMessage),
        handlerMethod = this.errorHandler[error];
    
    // handle any errors
    if (error && handlerMethod)
        handlerMethod(parsedMessage);
    
};

// export server object
module.exports = Server;
