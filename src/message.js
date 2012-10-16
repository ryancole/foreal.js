
function MessageHandler (server) {
    
    this.server = server;
    
};

MessageHandler.prototype.handleMessage = function (message) {
    
    // reference the handler method
    var handlerMethod = this['on' + message.command];
    
    // return result of handler method, if any
    if (handlerMethod)
        return handlerMethod.apply(this, [message]);
    
    // return unknown message
    return 'ERR_UNKNOWNCOMMAND';
    
};

MessageHandler.prototype.onJOIN = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 1)
        return 'ERR_NEEDMOREPARAMS';
    
    var requestedChannels = message.params.shift().split(','),
        requestedChannelKeys = message.params.shift();
    
    if (requestedChannelKeys)
        requestedChannelKeys = requestedChannelKeys.split(',');
    
    requestedChannels.forEach(function (requestedChannel, index) {
        
        
        
    });
    
};

MessageHandler.prototype.onNICK = function (message) {
    
    var client = message.client,
        requestedNickname = message.params.shift();
    
    // make sure the requested nick is valid
    if (requestedNickname.length == 0) {
        
        return 'ERR_NONICKNAMEGIVEN';
        
    } else if (requestedNickname == client.nickname) {
        
        return 'ERR_NICKNAMEINUSE';
        
    } else if (requestedNickname.length > 9) {
        
        return 'ERR_ERRONEUSNICKNAME';
        
    }
    
    // set the client nick
    client.settings.nickname = requestedNickname;
    
};

MessageHandler.prototype.onUSER = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 4)
        return 'ERR_NEEDMOREPARAMS';
    
    if (client.settings.registered == true)
        return 'ERR_ALREADYREGISTRED';
    
    // setting user registration variables
    client.settings.username = message.params.shift();
    client.settings.hostname = message.params.shift();
    client.settings.servername = message.params.shift();
    client.settings.realname = message.params.join(' ');
    client.settings.registered = true;
    
    // send welcoming messages
    client.send('375 %s :- %s Message of the Day - ', client.settings.nickname, this.server.settings.hostname);
    client.send('372 %s :- No message set', client.settings.nickname);
    client.send('376 %s :End of /MOTD command', client.settings.nickname);
    
};

MessageHandler.prototype.onMODE = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 1)
        return 'ERR_NEEDMOREPARAMS';
    
    var target = message.params.shift(),
        modes = message.params.shift();
    
    // differentiate between user and channel modes
    if (target[0] == '#' || target[0] == '&') {
        
        return 'ERR_UNKNOWNCOMMAND';
        
    } else {
        
        // make sure the users match
        if (target != client.settings.nickname)
            return 'ERR_USERSDONTMATCH';
        
        if (modes) {
            
            // modify user modes
            client.send('MODE %s %s', client.settings.nickname, modes);
            
        } else {
            
            // existing modes look-up
            client.send('221 %s %s', client.settings.nickname, client.settings.modes);
            
        }
        
    }
    
};

// export message handler class
module.exports = MessageHandler;
