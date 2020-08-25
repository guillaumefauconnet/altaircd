const protocol = require('../protocol');

module.exports = {
    motd(user) {
        user.send(this.host, protocol.reply.motdStart, user.nick, ':- Message of the Day -');
        user.send(this.host, protocol.reply.motd, user.nick, this.config.motd || 'No message set');
        user.send(this.host, protocol.reply.motdEnd, user.nick, ':End of /MOTD command.');
    }
}
