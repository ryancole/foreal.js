
var util = require('util'),
    events = require('events');


function Client (socket) {
    
    this.socket = socket;
    
    // client settings
    this.settings = {
        
        nickname: 'default',
        hostname: socket.remoteAddress,
        registered: false
        
    };
    
    // incoming message buffer
    this.buffer = '';
    
    // set event handlers
    this.socket.on('data', this.onData.bind(this));
    
};

// client inherits from event emitter
util.inherits(Client, events.EventEmitter);

Client.prototype.send = function () {
    
    // format the outbound message
    var outboundMessage = util.format.apply(this, arguments) + '\r\n';
    
    // send it to the client
    this.socket.write(outboundMessage);
    
};

Client.prototype.onData = function (buffer) {
    
    var lines = (this.buffer + buffer).split(/\r?\n/);
    
    // the last item in the array will be unfinished lines
    this.buffer = lines.pop();
    
    // emit each complete raw message
    lines.forEach(function (line) {
        
        this.emit('data', this, line.trim());
        
    }.bind(this));
    
};

// export client class
module.exports = Client;
