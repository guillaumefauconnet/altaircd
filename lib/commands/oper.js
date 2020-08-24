const irc = require('../protocol');
const security = require('../security');

// TODO: Local ops
module.exports = {
    OPER(user, name, password) {
        if (!name || !password) {
            user.send(user.server.host, irc.errors.wasNoSuchNick, user.nick, ':OPER requires a nick and password');
        } else {
            const self = user.server,
                targetUser = self.config.opers[name];

            if (targetUser === undefined) {
                user.send(self.host, irc.errors.noSuchNick, user.nick, ':No such nick.');
            } else {
                security.compareHash(password, targetUser.password, function (err, res) {
                    if (res) {
                        user.send(self.host, irc.reply.youAreOper, user.nick, ':You are now an IRC operator');
                        user.oper();
                    } else {
                        user.send(self.host, irc.errors.passwordWrong, user.nick || 'user', ':Password incorrect');
                    }
                });
            }
        }
    }
}
