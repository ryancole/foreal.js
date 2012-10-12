
function Protocol () {
    
    /* idk, yet */
    
};

Protocol.prototype.handleMessage = function (message) {
    
    // reference the handler method
    var handlerMethod = this['on' + message.command];
    
    // return result of handler method, if any
    if (handlerMethod)
        return handlerMethod(message);
    
};

Protocol.prototype.onNICK = function (message) {
    
    // set the client nick
    message.client.settings.nick = message.params;
    
    return message;
    
};

// export protocol class
module.exports = Protocol;
