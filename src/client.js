
var util = require('util'),
    events = require('events');


function Client (socket) {
    
    this.socket = socket;
    
    // client settings
    this.settings = {
        
        nickname: 'default',
        hostname: socket.remoteAddress,
        registered: false,
        lastping: Date.now(),
        channels: [],
        modes: [],
        
    };
    
    this.randomnum = Math.floor(Math.random()*11);
    
    // incoming message buffer
    this.buffer = '';
    
    // set event handlers
    this.socket.on('data', this.onData.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    
    // set ping pong timer
    this.pingpongTimer = setInterval(function () {
        
        // kill the connection if its timed out
        if ((Date.now() - this.settings.lastping) / 1000 > 60)
            return this.socket.end();
        
        // ask for a pong
        return this.send('PING %s', this.settings.nickname);
        
    }.bind(this), 10000);
    
};

// client inherits from event emitter
util.inherits(Client, events.EventEmitter);

Client.prototype.send = function () {
    
    // format the outbound message
    var outboundMessage = util.format.apply(this, arguments) + '\r\n';
    
    // send it to the client
    return this.socket.write(outboundMessage);
    
};

Client.prototype.quit = function () {
    
    // notify others of the departure
    this.settings.channels.forEach(function (channel) {
        
        console.log(channel);
        
    });
    
};

Client.prototype.onData = function (buffer) {
    
    var lines = (this.buffer + buffer).split(/\r?\n/);
    
    // the last item in the array will be unfinished lines
    this.buffer = lines.pop();
    
    // emit each complete raw message
    lines.forEach(function (line) {
        
        this.emit('data', this, line.trim());
        
    }.bind(this));
    
    // update last ping pong time
    this.settings.lastping = Date.now();
    
};

Client.prototype.onClose = function (had_error) {
    
    // remove all event listeners
    this.removeAllListeners();
    this.socket.removeAllListeners();
    
    // clear ping pong timer
    clearInterval(this.pingpongTimer);
    
    // dispatch quit messages
    this.quit();
    
    // todo: remove from channels
    
    // remove from user list
    
    
};

// export client class
module.exports = Client;
