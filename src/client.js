
// std libs
var util = require('util');

// lib libs
var ErrorHandler = require('./error'),
    MessageHandler = require('./message');


function Client (socket, server) {
    
    this.socket = socket;
    this.server = server;
    
    // set event handlers
    this.socket.on('data', this.onData.bind(this));
    
    // pending data buffer
    this.buffer = '';
    
    // client attributes
    this.attributes = {
        
        modes: [],
        lastping: Date.now(),
        registered: false
        
    };
    
};

Client.prototype = {
    
    get mask() {
        
        return this.attributes.nickname + '!' + this.attributes.username + '@' + this.attributes.hostname;
        
    }
    
};

Client.prototype.onData = function (buffer) {
    
    var lines = (this.buffer + buffer).split(/\r?\n/);
    
    // the last item in the array will be unfinished lines
    this.buffer = lines.pop();
    
    // emit each complete raw message
    lines.forEach(function (line) {
        
        // convert the raw data into a parsed message
        var message = MessageHandler.parseMessage.call(this, line.trim());
        
        // handle the message
        var error = MessageHandler.handleMessage(message);
        
        // handle an error
        if (error)
            ErrorHandler.handleError(error);
        
    }.bind(this));
    
    // update last ping pong time
    this.attributes.lastping = Date.now();
    
};

Client.prototype.send = function () {
    
    // format the outbound message
    var outboundMessage = util.format.apply(this, arguments) + '\r\n';
    
    // send it to the client
    return this.socket.write(outboundMessage);
    
};

module.exports = Client;
