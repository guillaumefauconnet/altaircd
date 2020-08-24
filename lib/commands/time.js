const irc = require('../protocol');

module.exports = {
    TIME(user, server) {
        // TODO: server
        user.send(this.server.host, irc.reply.time, user.nick, this.server.config.hostname, ':' + (new Date()));
    }
}
