
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
    
    return null;
    
};

Server.prototype.getChannel = function (name) {
    
    for (var x = 0; x < this.collections.channels.length; x++) {
        
        var channel = this.collections.channels[x];
        
        // return matched channel based on name
        if (channel.attributes.name == name)
            return channel;
        
    }
    
    return null;
    
};

Server.prototype.quitClient = function (client) {
    
    // close the client's socket
    client.socket.end();
    
    // remove the client from the collection
    if (this.collections.clients.indexOf(client) != -1)
        this.collections.clients.splice(this.collections.clients.indexOf(client), 1);
    
    // for all users in channels that this client was in, send
    // :warz_!warz@netadmin.betawarz.com QUIT :Quit: what what
    
};

// export server object
module.exports = Server;
