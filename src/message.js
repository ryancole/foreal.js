
var ErrorHandler = require('./error');


function MessageHandler () {
    
    /* idk yet */
    
};

MessageHandler.prototype.parseMessage = function (data) {
    
    var parsedMessage = {
        
        client: this
        
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
    
    return parsedMessage;
    
};

MessageHandler.prototype.handleMessage = function (message) {
    
    // reference the handler method
    var handlerMethod = this['on' + message.command];
    
    // return result of handler method, if any
    if (handlerMethod)
        return handlerMethod.call(this, message);
    
    // return unknown message
    return ErrorHandler.createError('ERR_UNKNOWNCOMMAND', message);
    
};

MessageHandler.prototype.onJOIN = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 1)
        return ErrorHandler.createError('ERR_NEEDMOREPARAMS', message);
    
    var requestedChannels = message.params.shift().split(','),
        requestedChannelKeys = message.params.shift();
    
    if (requestedChannelKeys)
        requestedChannelKeys = requestedChannelKeys.split(',');
    
    requestedChannels.forEach(function (requestedChannel, index) {
        
        
        
    });
    
};

MessageHandler.prototype.onNICK = function (message) {
    
    var client = message.client,
        requestedNickname = message.params.shift().trim();
    
    // lob off leading semi colon
    if (requestedNickname[0] == ':')
        requestedNickname = requestedNickname.slice(1).trim();
    
    // make sure the requested nick is valid
    if (requestedNickname.length == 0) {
        
        return ErrorHandler.createError('ERR_NONICKNAMEGIVEN', message);
        
    } else if (requestedNickname == client.attributes.nickname || client.server.getClient(requestedNickname)) {
        
        return ErrorHandler.createError('ERR_NICKNAMEINUSE', message, { nickname: requestedNickname });
        
    } else if (requestedNickname.length > 9) {
        
        return ErrorHandler.createError('ERR_ERRONEUSNICKNAME', message, { nickname: requestedNickname });
        
    }
    
    // notify the user of the nickname change
    client.send(':%s NICK :%s', client.mask, requestedNickname);
    
    // set the client nickname
    client.attributes.nickname = requestedNickname;
    
};

MessageHandler.prototype.onUSER = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 4)
        return ErrorHandler.createError('ERR_NEEDMOREPARAMS', message);
    
    if (client.attributes.registered == true)
        return ErrorHandler.createError('ERR_ALREADYREGISTRED', message);
    
    // setting user registration variables
    client.attributes.username = message.params.shift();
    client.attributes.hostname = message.params.shift();
    client.attributes.servername = message.params.shift();
    client.attributes.realname = message.params.join(' ');
    client.attributes.registered = true;
    
    // send welcoming messages
    client.send('375 %s :- %s Message of the Day - ', client.attributes.nickname, client.server.settings.hostname);
    client.send('372 %s :- No message set', client.attributes.nickname);
    client.send('376 %s :End of /MOTD command', client.attributes.nickname);
    
};

MessageHandler.prototype.onMODE = function (message) {
    
    var client = message.client;
    
    if (message.params.length < 1)
        return ErrorHandler.createError('ERR_NEEDMOREPARAMS', message);
    
    var target = message.params.shift(),
        modes = message.params.shift();
    
    // differentiate between user and channel modes
    if (target[0] == '#' || target[0] == '&') {
        
        return ErrorHandler.createError('ERR_UNKNOWNCOMMAND', message);
        
    } else {
        
        // make sure the users match
        if (target != client.attributes.nickname)
            return ErrorHandler.createError('ERR_USERSDONTMATCH', message);
        
        if (modes) {
            
            // modify user modes
            client.send('MODE %s %s', client.attributes.nickname, modes);
            
        } else {
            
            // existing modes look-up
            client.send('221 %s %s', client.attributes.nickname, client.attributes.modes);
            
        }
        
    }
    
};

// export message handler instance
module.exports = new MessageHandler;
