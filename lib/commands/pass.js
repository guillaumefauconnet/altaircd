const security = require('../security');
const protocol = require('../protocol');

module.exports = {
    PASS(user, password) {
        const self = user.server;
        security.compareHash(password, self.config.serverPassword, function (err, res) {
            if (res) {
                user.passwordAccepted = true;
                user.server = self;
                user.runPostAuthQueue();
            } else {
                user.send(self.host, protocol.errors.passwordWrong, user.nick || 'user', ':Password incorrect');
                user.quit();
            }
        });
    }
}
