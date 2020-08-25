module.exports = {
    onInviteList(user) {
        const userNick = this.server.normalizeName(user.nick),
            server = this.server;
        return this.inviteList.some(function (nick) {
            return server.normalizeName(nick) === userNick;
        });
    }
}
