
function ErrorHandler () {
    
    /* idk yet */
    
};

ErrorHandler.prototype.createError = function (name, message, arguments) {
    
    return {
        
        name: name,
        client: message.client,
        command: message.command,
        arguments: arguments
        
    };
    
};

ErrorHandler.prototype.handleError = function (error) {
    
    // reference the handler method
    var handlerMethod = this[error.name];
    
    // return result of handler method, if any
    if (handlerMethod)
        return handlerMethod(error);
    
    console.log('no error handle defined for: %s', error.name);
    
};

ErrorHandler.prototype.ERR_UNKNOWNCOMMAND = function (error) {
    
    return error.client.send('421 %s %s :Unknown command', error.client.attributes.nickname, error.command);
    
};

ErrorHandler.prototype.ERR_NEEDMOREPARAMS = function (error) {
    
    return error.client.send('461 %s %s :Not enough parameters', error.client.attributes.nickname, error.command);
    
};

ErrorHandler.prototype.ERR_USERSDONTMATCH = function (error) {
    
    return error.client.send('502 %s :Cant change mode for other users', error.client.attributes.nickname);
    
};

ErrorHandler.prototype.ERR_NICKNAMEINUSE = function (error) {
    
    return error.client.send('433 %s %s :Nickname is already in use', error.client.attributes.nickname, error.arguments.nickname);
    
};

ErrorHandler.prototype.ERR_ERRONEUSNICKNAME = function (error) {
    
   return error.client.send('432 %s %s :Erroneus nickname', error.client.attributes.nickname, error.arguments.nickname);
    
};

// export error handler class
module.exports = new ErrorHandler;
