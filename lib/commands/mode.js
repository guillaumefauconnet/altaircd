const protocol = require('../protocol');

module.exports = {
    MODE(user, target, modes, arg) {
        // TODO: This should work with multiple parameters, like the definition:
        // <channel> {[+|-]|o|p|s|i|t|n|b|v} [<limit>] [<user>] [<ban mask>]
        // o - give/take channel operator privileges                   [done]
        // p - private channel flag                                    [done]
        // s - secret channel flag;                                    [done] - what's the difference?
        // i - invite-only channel flag;                               [done]
        // t - topic settable by channel operator only flag;           [done]
        // n - no messages to channel from clients on the outside;     [done]
        // m - moderated channel;                                      [done]
        // l - set the user limit to channel;                          [done]
        // b - set a ban mask to keep users out;                       [done]
        // v - give/take the ability to speak on a moderated channel;  [done]
        // k - set a channel key (password).                           [done]

        // User modes
        // a - user is flagged as away;                                [done]
        // i - marks a users as invisible;                             [done]
        // w - user receives wallops;                                  [done]
        // r - restricted user connection;
        // o - operator flag;
        // O - local operator flag;
        // s - marks a user for receipt of server notices.
        const server = user.server;

        if (user.server.channelTarget(target)) {
            const channel = user.server.channels.find(target);
            if (!channel) {
                // TODO: Error
            } else if (modes) {
                if (modes[0] === '+') {
                    channel.addModes(user, modes, arg);
                } else if (modes[0] === '-') {
                    channel.removeModes(user, modes, arg);
                } else if (modes === 'b') {
                    channel.banned.forEach(function (ban) {
                        user.send(server.host, protocol.reply.banList, user.nick, channel.name, ban.mask, ban.user.nick, ban.timestamp);
                    });
                    user.send(user.server.host, protocol.reply.endBan, user.nick, channel.name, ':End of Channel Ban List');
                }
            } else {
                user.send(user.server.host, protocol.reply.channelModes, user.nick, channel.name, channel.modes);
            }
        } else {
            // TODO: Server user modes
            const targetUser = user.server.users.find(target);
            if (targetUser) {
                if (modes[0] === '+') {
                    targetUser.addModes(user, modes, arg);
                } else if (modes[0] === '-') {
                    targetUser.removeModes(user, modes, arg);
                }
            }
        }
    }
}
