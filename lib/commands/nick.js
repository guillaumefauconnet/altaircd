var irc = require('../protocol');

module.exports = {
    NICK(user, nick) {
        const oldMask = user.mask;

        if (!nick || nick.length === 0) {
            return user.send(user.server.host, irc.errors.noNickGiven, ':No nickname given');
        } else if (nick === user.nick) {
            return;
        } else if (nick.length > (user.server.config.maxNickLength || 9) || nick.match(irc.validations.invalidNick)) {
            return user.send(user.server.host, irc.errors.badNick, (user.nick || ''), nick, ':Erroneus nickname');
        } else if (user.server.valueExists(nick, user.server.users.registered, 'nick')) {
            return user.send(user.server.host, irc.errors.nameInUse, '*', nick, ':is already in use');
        }

        nick = nick.trim();
        user.send(user.mask, 'NICK', ':' + nick);

        user.channels.forEach(function (channel) {
            const users = channel.users.splice(channel.users.indexOf(user), 1);
            channel.sendToGroup(users, user.mask + ' NICK : ' + nick);
        });

        user.nick = nick.trim();
        user.register();
    }
}