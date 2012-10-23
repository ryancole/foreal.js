
//  std libs
var net = require('net');

// lib libs
var Client = require('./client');


function Server () {
    
    // server settings
    this.settings = {
        
        hostname: 'ryan-server'
        
    };
    
    // server collections
    this.collections = {
        
        clients: [],
        channels: []
        
    };
    
    // init net.server instance
    this.server = new net.Server(this.onConnection.bind(this));
    
};

Server.prototype.onConnection = function (socket) {
    
    // add new client to collection
    this.collections.clients.push(new Client(socket, this));
    
};

Server.prototype.listen = function (port) {
    
    // begin accepting connections
    this.server.listen(port);
    
};

Server.prototype.getClient = function (nickname) {
    
    for (var x = 0; x < this.collections.clients.length; x++) {
        
        var client = this.collections.clients[x];
        
        // return matched client based on nickname
        if (client.attributes.nickname == nickname)
            return client;
        
    }
    
};

// export server object
module.exports = Server;
