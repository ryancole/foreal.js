
function ErrorHandler (server) {
    
    this.server = server;
    
};

ErrorHandler.prototype.ERR_NEEDMOREPARAMS = function (message) {
    
    return message.client.send('461 %s %s :Not enough parameters', message.client.settings.nickname, message.command);
    
};

ErrorHandler.prototype.ERR_UNKNOWNCOMMAND = function (message) {
    
    return message.client.send('421 %s %s :Unknown command', message.client.settings.nickname, message.command);
    
};

ErrorHandler.prototype.ERR_USERSDONTMATCH = function (message) {
    
    return message.client.send('502 %s :Cant change mode for other users', message.client.settings.nickname);
    
};

// export error handler class
module.exports = ErrorHandler;
