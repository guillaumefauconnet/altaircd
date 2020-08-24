module.exports = {
    QUIT(user, message) {
        user.quit(message);
        user.server.history.add(user);
        delete user;
    }
}