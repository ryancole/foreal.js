
function Protocol (server) {
    
    this.server = server;
    
};

Protocol.prototype.handleMessage = function (message) {
    
    // reference the handler method
    var handlerMethod = this['on' + message.command];
    
    // return result of handler method, if any
    if (handlerMethod)
        return handlerMethod.apply(this, [message]);
    
    // return unknown message handler
    return this.onUnknownMessage(message);
    
};

Protocol.prototype.onJOIN = function (message) {
    
    var client = message.client,
        params = message.params.split(' ');
    
    if (params.length < 1)
        return 'ERR_NEEDMOREPARAMS';
    
    var requestedChannels = params.shift().split(','),
        requestedChannelKeys = params.shift();
    
    if (requestedChannelKeys)
        requestedChannelKeys = requestedChannelKeys.split(',');
    
    requestedChannels.forEach(function (requestedChannel, index) {
        
        
        
    });
    
};

Protocol.prototype.onNICK = function (message) {
    
    var client = message.client,
        requestedNickname = message.params.trim();
    
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

Protocol.prototype.onUSER = function (message) {
    
    var client = message.client,
        params = message.params.split(' ');
    
    if (params.length < 4)
        return 'ERR_NEEDMOREPARAMS';
    
    if (client.settings.registered == true)
        return 'ERR_ALREADYREGISTRED';
    
    // setting user registration variables
    client.settings.username = params.shift();
    client.settings.hostname = params.shift();
    client.settings.servername = params.shift();
    client.settings.realname = params.join(' ');
    client.settings.registered = true;
    
    // send welcoming messages
    client.send('375 %s :- %s Message of the Day - ', client.settings.nickname, this.server.settings.hostname);
    client.send('372 %s :- No message set', client.settings.nickname);
    client.send('376 %s :End of /MOTD command', client.settings.nickname);
    
};

Protocol.prototype.onMODE = function (message) {
    
    var client = message.client,
        params = message.params.split(' ');
    
    if (params.length < 2)
        return 'ERR_NEEDMOREPARAMS';
    
    var target = params.shift(),
        modes = params.shift(),
        forChannel = (target[0] == '#' || target[0] == '&');
    
    if (forChannel == true) {
        
        
        
    } else if (forChannel == false && params.length == 0) {
        
        if (target != client.settings.nickname)
            return 'ERR_USERSDONTMATCH';
        
    }
    
};

Protocol.prototype.onUnknownMessage = function (message) {
    
    var client = message.client,
        command = message.command;
    
    // notify the client of the unknown command
    client.send('421 %s %s :Unknown command', client.settings.nickname, command);
    
};

// export protocol class
module.exports = Protocol;
