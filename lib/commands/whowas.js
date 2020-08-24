const irc = require('../protocol');

module.exports = {
    WHOWAS(user, nicknames, count, serverName) {
        // TODO: Server
        const server = user.server;
        let found = false;
        nicknames.split(',').forEach(function (nick) {
            let matches = server.history.find(nick);
            if (count) matches = matches.slice(0, count);
            matches.forEach(function (item) {
                found = true;
                user.send(server.host, irc.reply.whoWasUser, user.nick, item.nick, item.username, item.host, '*', ':' + item.realname);
                user.send(server.host, irc.reply.whoIsServer, user.nick, item.nick, item.server, ':' + item.time);
            });
        });

        if (found) {
            user.send(user.server.host, irc.reply.endWhoWas, user.nick, nicknames, ':End of WHOWAS');
        } else {
            user.send(user.server.host, irc.errors.wasNoSuchNick, user.nick, nicknames, ':There was no such nickname');
        }
    }
}
