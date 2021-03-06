const protocol = require('../protocol');

module.exports = {
    NAMES(user, targets) {
        const server = user.server;
        if (targets) {
            targets = targets.split(',');
            targets.forEach(function (target) {
                // if channel is secret or private, ignore
                const channel = server.channels.find(target);
                if (channel && (channel.isPublic || channel.isMember(user))) {
                    user.send(server.host, protocol.reply.nameReply, user.nick, channel.type, channel.name, ':' + channel.names);
                }
            });
        }
        user.send(user.server.host, protocol.reply.endNames, user.nick, '*', ':End of /NAMES list.');
    }
}
