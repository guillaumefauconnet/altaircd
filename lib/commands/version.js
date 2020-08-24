const irc = require('../protocol');

module.exports = {
    VERSION(user, server) {
        // TODO: server
        user.send(user.server.host,
            irc.reply.version,
            user.nick,
            user.server.version + '.' + (user.server.debug ? 'debug' : ''),
            user.server.config.hostname, ':' + user.server.config.name
        );
    }
}
