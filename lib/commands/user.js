module.exports = {
    USER(user, username, hostname, servername, realname) {
        user.server.users.register(user, username, hostname, servername, realname);
    }
}
