const protocol = require('../protocol');

module.exports = {
    VERSION(user, server) {
        // TODO: server
        user.send(user.server.host,
            protocol.reply.version,
            user.nick,
            user.server.version + '.' + (user.server.debug ? 'debug' : ''),
            user.server.config.hostname, ':' + user.server.config.name
        );
    }
}
