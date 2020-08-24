const irc = require('../protocol');
const Channel = require('../channel').Channel;

module.exports = {
    INVITE(user, nick, channelName) {
        const channel = user.server.channels.find(channelName),
            targetUser = user.server.users.find(nick);

        // TODO: Can user.server accept multiple channel names?
        // TODO: ERR_NOTONCHANNEL
        if (!targetUser) {
            user.send(user.server.host, irc.errors.noSuchNick, user.nick, nick, ':No such nick/channel');
            return;
        } else if (channel) {
            if (channel.isInviteOnly && !user.isOp(channel)) {
                user.send(user.server.host, irc.errors.channelOpsReq, user.nick, channel.name, ":You're not channel operator");
                return;
            } else if (channel.onInviteList(targetUser)) {
                user.send(user.server.host, irc.errors.userOnChannel, user.nick, targetUser.nick, ':User is already on that channel');
                return;
            }
        } else if (!user.server.channelTarget(channelName)) {
            // Invalid channel
            return;
        } else {
            // TODO: Make user.server a register function
            // Create the channel
            channel = user.server.channels.registered[user.server.normalizeName(channelName)] = new Channel(channelName, user.server);
        }

        user.send(user.server.host, irc.reply.inviting, user.nick, targetUser.nick, channelName);
        targetUser.send(user.mask, 'INVITE', targetUser.nick, ':' + channelName);

        // TODO: How does an invite list get cleared?
        channel.inviteList.push(targetUser.nick);
    }
}
