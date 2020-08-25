const protocol = require('../protocol')

module.exports = {
    AWAY(user, message) {
        if (user.isAway && (!message || message.length === 0)) {
            user.isAway = false;
            user.awayMessage = null;
            user.send(user.server.host, protocol.reply.unaway, user.nick, ':You are no longer marked as being away');
        } else if (message && message.length > 0) {
            user.isAway = true;
            user.awayMessage = message;
            user.send(user.server.host, protocol.reply.nowAway, user.nick, ':You have been marked as being away');
        } else {
            user.send(user.server.host, protocol.errors.needMoreParams, user.nick, ':Need more parameters');
        }
    }
}
