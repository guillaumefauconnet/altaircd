const winston = require('winston');

module.exports = {
    send() {
        const message = arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments).join(' ');
        const server = this.server;

        this.users.forEach(function (user) {
            try {
                // TODO: If this user is on another server, route the message to the user
                // 1. There needs to be a server map stored on each server
                // 2. This can then be used to route with BFS (http://en.wikipedia.org/wiki/Breadth-first_search)
                // 3. Spanning-tree loop detection should be implemented
                user.send(message);
            } catch (exception) {
                winston.error('Error writing to stream:', exception);
            }
        });
    },

    sendToGroup(users, message) {
        const server = this.server;

        users.forEach(function (user) {
            try {
                // TODO: If this user is on another server, route the message to the user
                // 1. There needs to be a server map stored on each server
                // 2. This can then be used to route with BFS (http://en.wikipedia.org/wiki/Breadth-first_search)
                // 3. Spanning-tree loop detection should be implemented
                user.send(message);
            } catch (exception) {
                winston.error('Error writing to stream:', exception);
            }
        });
    }
}
