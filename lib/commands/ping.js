module.exports = {
    PING(user, hostname) {
        user.lastPing = Date.now();
        user.send(user.server.host, 'PONG', user.server.config.hostname, user.server.host);
    }
}
