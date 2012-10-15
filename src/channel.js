
function Channel () {
    
    this.users = [];
    
};

Channel.prototype.addUser = function (user) {
    
    this.users.push(user);
    
};
