const irc = require('../protocol');

module.exports = {
    motd(user) {
        user.send(this.host, irc.reply.motdStart, user.nick, ':- Message of the Day -');
        user.send(this.host, irc.reply.motd, user.nick, this.config.motd || 'No message set');
        user.send(this.host, irc.reply.motdEnd, user.nick, ':End of /MOTD command.');
    }
}
