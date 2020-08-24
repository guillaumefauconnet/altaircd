const irc = require('../protocol');

module.exports = {
    WHO(user, target) {
        const server = user.server;

        if (user.server.channelTarget(target)) {
            // TODO: Channel wildcards
            const channel = user.server.channels.find(target);

            if (!channel) {
                user.send(user.server.host, irc.errors.noSuchChannel, user.nick, ':No such channel');
            } else {
                channel.users.forEach(function (channelUser) {
                    if (channelUser.isInvisible
                        && !user.isOper
                        && channel.users.indexOf(user) === -1) {
                        return;
                    } else {
                        user.send(server.host,
                            irc.reply.who,
                            user.nick,
                            channel.name,
                            channelUser.username,
                            channelUser.hostname,
                            server.config.hostname, // The IRC server rather than the network
                            channelUser.channelNick(channel),
                            'H', // TODO: H is here, G is gone, * is IRC operator, + is voice, @ is chanop
                            ':0',
                            channelUser.realname);
                    }
                });
                user.send(user.server.host, irc.reply.endWho, user.nick, channel.name, ':End of /WHO list.');
            }
        } else {
            const matcher = user.server.normalizeName(target).replace(/\?/g, '.');
            user.server.users.registered.forEach(function (targetUser) {
                try {
                    if (!targetUser.nick.match('^' + matcher + '$')) return;
                } catch (e) {
                    return;
                }

                const sharedChannel = targetUser.sharedChannelWith(user);
                if (targetUser.isInvisible
                    && !user.isOper
                    && !sharedChannel) {
                    return;
                } else {
                    user.send(server.host,
                        irc.reply.who,
                        user.nick,
                        sharedChannel ? sharedChannel.name : '',
                        targetUser.username,
                        targetUser.hostname,
                        server.config.hostname,
                        targetUser.channelNick(channel),
                        'H', // TODO
                        ':0',
                        targetUser.realname);
                }
            });
            user.send(user.server.host, irc.reply.endWho, user.nick, target, ':End of /WHO list.');
        }
    }
}
