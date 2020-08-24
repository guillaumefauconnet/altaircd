const irc = require('../protocol');

module.exports = {
    TOPIC(user, channelName, topic) {
        const channel = user.server.channels.find(channelName);

        if (!channel) {
            user.send(user.server.host, irc.errors.noSuchNick, user.nick, channelName, ':No such nick/channel');
        } else {
            if (channel.modes.indexOf('t') === -1 || user.isHop(channel)) {
                channel.topic = topic;
                channel.send(user.mask, 'TOPIC', channel.name, ':' + topic);
            } else {
                user.send(user.server.host, irc.errors.channelOpsReq, user.nick, channel.name, ":You must be at least half-op to do that!");
            }
        }
    }
}
