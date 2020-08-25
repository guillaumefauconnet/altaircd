const protocol = require('../protocol');

module.exports = {
    KICK(user, channels, users, kickMessage) {
        const channelMasks = channels.split(',');
        const userNames = users.split(',');
        const server = user.server;

        kickMessage = kickMessage ? ':' + kickMessage : ':' + user.nick;

        // ERR_BADCHANMASK

        if (userNames.length !== channelMasks.length) {
            user.send(user.server.host, protocol.errors.needMoreParams, user.nick, ':Need more parameters');
        } else {
            channelMasks.forEach((channelMask, i) => {
                let channel = server.channels.findWithMask(channelMask);
                let userName = userNames[i];
                let targetUser;

                if (!channel) {
                    user.send(server.host, protocol.errors.noSuchChannel, ':No such channel');
                    return;
                }

                targetUser = channel.findUserNamed(userName);

                if (!channel.findUserNamed(user.nick)) {
                    user.send(server.host, protocol.errors.notOnChannel, user.nick, channel.name, ':Not on channel');
                } else if (!targetUser) {
                    user.send(server.host, protocol.errors.userNotInChannel, userName, channel.name, ':User not in channel');
                } else if (!user.isOp(channel)) {
                    user.send(server.host, protocol.errors.channelOpsReq, user.nick, channel.name, ":You're not channel operator");
                } else {
                    channel.send(user.mask, 'KICK', channel.name, targetUser.nick, kickMessage);
                    channel.part(targetUser);
                }
            });
        }
    }
}
