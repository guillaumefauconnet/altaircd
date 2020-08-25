const protocol = require('../protocol');

module.exports = {
    WHOIS(user, nickmask) {
        // TODO: nick masks
        //console.log(server.server)
        const target = user.server.users.find(nickmask);
        if (target) {
            const channels = target.channels.map(function (channel) {
                if (channel.isSecret && !channel.isMember(user)) return;

                if (target.isOp(channel)) {
                    return '@' + channel.name;
                } else {
                    return channel.name;
                }
            });

            user.send(user.server.host, protocol.reply.whoIsUser, user.nick, target.nick,
                target.username, target.hostname, '*', ':' + target.realname);
            user.send(user.server.host, protocol.reply.whoIsChannels, user.nick, target.nick, ':' + channels);
            user.send(user.server.host, protocol.reply.whoIsServer, user.nick, target.nick, user.server.config.hostname, ':' + user.server.config.serverDescription);
            if (target.isAway) {
                user.send(user.server.host, protocol.reply.away, user.nick, target.nick, ':' + target.awayMessage);
            }
            user.send(user.server.host, protocol.reply.whoIsIdle, user.nick, target.nick, target.idle, user.created, ':seconds idle, sign on time');
            user.send(user.server.host, protocol.reply.endOfWhoIs, user.nick, target.nick, ':End of /WHOIS list.');
        } else if (!nickmask || nickmask.length === 0) {
            user.send(user.server.host, protocol.errors.noNickGiven, user.nick, ':No nick given');
        } else {
            user.send(user.server.host, protocol.errors.noSuchNick, user.nick, nickmask, ':No such nick/channel');
        }
    }
}
