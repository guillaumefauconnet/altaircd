module.exports = {
    respondToMessage(user, message) {
        this.commands[message.command].apply(this.commands, [user].concat(message.args));
    },

    respond(data, client) {
        const message = this.parse(data);

        if (this.validCommand(message.command)) {
            if (this.config.serverPassword && !client.object.passwordAccepted) {
                this.queueResponse(client, message);
            } else {
                this.respondToMessage(client.object, message);
            }
        }
    },

    queueResponse(client, message) {
        if ('PASS' === message.command) {
            // Respond now
            client.object.pendingAuth = false;
            this.respondToMessage(client.object, message);
        } else {
            client.object.queue(message);
        }
    }
}
