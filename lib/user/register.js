const protocol = require('../protocol');

module.exports = {
    register() {
        if (this.registered === false
            && this.nick
            && this.username) {
            this.serverName = this.config.name;
            this.send(this.server.host, protocol.reply.welcome, this.nick, 'Welcome to the ' + this.config.network + ' IRC network', this.mask);
            this.send(this.server.host, protocol.reply.yourHost, this.nick, 'Your host is', this.config.hostname, 'running version', this.server.version);
            this.send(this.server.host, protocol.reply.created, this.nick, 'This server was created on', this.server.created);
            this.send(this.server.host, protocol.reply.myInfo, this.nick, this.config.name, this.server.version);
            this.server.motd(this);
            this.registered = true;
            this.addMode.w.apply(this);
        }
    }
}
