class History {
    constructor(server) {
        this.server = server;
        this.config = server.config;
        this.items = [];
    }

    add(user) {
        this.items.unshift({
            nick: user.nick,
            username: user.username,
            realname: user.realname,
            host: user.hostname,
            server: user.serverName,
            time: new Date()
        });
        if (this.config) {
            this.items.slice(0, this.config.whoWasLimit);
        }
    }

    find(nick) {
        return this.items.filter(function (item) {
            return nick === item.nick;
        });
    }
}

module.exports = History;
