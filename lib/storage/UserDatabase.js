class UserDatabase {
    constructor(server) {
        this.server = server;
        this.config = server.config;
        this.registered = [];
    }

    forEach(fn) {
        this.registered.forEach(fn);
    }

    push(user) {
        this.registered.push(user);
    }

    register(user, username, hostname, servername, realname) {
        user.username = username;
        user.realname = realname;
        this.registered.push(user);
        user.register();
    }

    find(nick) {
        nick = this.server.normalizeName(nick);
        for (var i = 0; i < this.registered.length; i++) {
            if (this.registered[i] && this.server.normalizeName(this.registered[i].nick) === nick)
                return this.registered[i];
        }
    }

    remove(user) {
        if (this.registered.indexOf(user) !== -1) {
            this.registered.splice(this.registered.indexOf(user), 1);
        }
    }
}

module.exports = UserDatabase;
