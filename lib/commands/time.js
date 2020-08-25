const protocol = require('../protocol');

module.exports = {
    TIME(user, server) {
        // TODO: server
        user.send(this.server.host, protocol.reply.time, user.nick, this.server.config.hostname, ':' + (new Date()));
    }
}
