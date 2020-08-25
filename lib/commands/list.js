const protocol = require('../protocol');

module.exports = {
    LIST(user, targets) {
        // TODO: ERR_TOOMANYMATCHES
        // TODO: ERR_NOSUCHSERVER
        const server = user.server;
        let channels = {};

        user.send(user.server.host, protocol.reply.listStart, user.nick, 'Channel', ':Users  Name');
        if (targets) {
            targets = targets.split(',');
            targets.forEach(function (target) {
                const channel = server.channels.find(target);
                if (channel) {
                    channels[channel.name] = channel;
                }
            });
        } else {
            channels = user.server.channels.registered;
        }

        for (let i in channels) {
            const channel = channels[i];
            // if channel is secret or private, ignore
            if (channel.isPublic || channel.isMember(user)) {
                user.send(user.server.host, protocol.reply.list, user.nick, channel.name, channel.memberCount, ':[' + channel.modes + '] ' + channel.topic);
            }
        }

        user.send(user.server.host, protocol.reply.listEnd, user.nick, ':End of /LIST');
    }
}
