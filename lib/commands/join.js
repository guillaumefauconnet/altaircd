const protocol = require('../protocol');

module.exports = {
    JOIN(user, channelNames, key) {
        const server = user.server;
        if (!channelNames || !channelNames.length) {
            return user.send(user.server.host, protocol.errors.needMoreParams, user.nick, ':Need more parameters');
        }

        channelNames.split(',').forEach(function (args) {
            const nameParts = args.split(' '),
                channelName = nameParts[0];

            if (!server.channelTarget(channelName)
                || channelName.match(protocol.validations.invalidChannel)) {
                user.send(server.host, protocol.errors.noSuchChannel, ':No such channel');
            } else {
                server.channels.join(user, channelName, key);
            }
        });
    }
}
