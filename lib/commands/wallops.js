const protocol = require('../protocol');

module.exports = {
    WALLOPS(user, text) {
        if (!text || text.length === 0) {
            user.send(user.server.host, protocol.errors.needMoreParams, user.nick, ':Need more parameters');
            return;
        }

        user.server.users.registered.forEach(function (user) {
            if (user.modes.indexOf('w') !== -1) {
                user.send(user.server.host, 'WALLOPS', ':OPERWALL - ' + text);
            }
        });
    }
}
