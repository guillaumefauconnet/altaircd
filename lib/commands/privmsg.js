const irc = require('../protocol');

module.exports = {
    PRIVMSG(user, target, message) {
        // TODO: The RFC says the sender nick and actual user nick should be checked
        // TODO: Message validation

        // ERR_NOTOPLEVEL
        // ERR_WILDTOPLEVEL
        // ERR_TOOMANYTARGETS
        // ERR_NOSUCHNICK
        // RPL_AWAY
        if (!target || target.length === 0) {
            user.send(user.server.host, irc.errors.noRecipient, ':No recipient given');
        } else if (!message || message.length === 0) {
            user.send(user.server.host, irc.errors.noTextToSend, ':No text to send');
        } else if (user.server.channelTarget(target)) {
            const channel = user.server.channels.find(target);
            if (!channel) {
                user.send(user.server.host, irc.errors.noSuchNick, user.nick, target, ':No such nick/channel');
            } else if (channel.isModerated && !user.isVoiced(channel)) {
                user.send(user.server.host, irc.errors.cannotSend, channel.name, ':Cannot send to channel');
            } else if (user.channels.indexOf(channel) === -1) {
                if (channel.modes.indexOf('n') !== -1) {
                    user.send(user.server.host, irc.errors.cannotSend, channel.name, ':Cannot send to channel');
                    return;
                }
            } else {
                user.server.channels.message(user, channel, message);
            }
        } else {
            user.message(target, message);
        }
    }
}
