const protocol = require('../protocol');

module.exports = {
    message(nick, message) {
        const user = this.server.users.find(nick);
        this.updated = new Date();

        if (user) {
            if (user.isAway) {
                this.send(this.server.host, protocol.reply.away, this.nick, user.nick, ':' + user.awayMessage);
            }
            user.send(this.mask, 'PRIVMSG', user.nick, ':' + message);
        } else {
            this.send(this.server.host, protocol.errors.noSuchNick, this.nick, nick, ':No such nick/channel');
        }
    }
}