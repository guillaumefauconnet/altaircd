const security = require('../security');

module.exports = {
    PASS(user, password) {
        const self = user.server;
        security.compareHash(password, self.config.serverPassword, function (err, res) {
            if (res) {
                user.passwordAccepted = true;
                user.server = self;
                user.runPostAuthQueue();
            } else {
                user.send(self.host, irc.errors.passwordWrong, user.nick || 'user', ':Password incorrect');
                user.quit();
            }
        });
    }
}
