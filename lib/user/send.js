const winston = require('winston');

module.exports = {
    send() {
        if (!this.stream) return;

        const self = this;
        const message = arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments).join(' ');

        winston.log('S: [' + this.nick + '] ' + message);

        try {
            if (this.stream.constructor.name === 'Socket') {
                this.stream.write(message + '\r\n');
            }
            if (this.stream.constructor.name === 'WebSocket') {
                this.stream.send(message + '\r\n');
            }
        } catch (exception) {
            winston.error('[' + this.nick + '] error writing to stream:', exception);

            // This setTimeout helps prevent against race conditions when multiple clients disconnect at the same time
            setTimeout(function () {
                if (!self.disconnected) {
                    self.disconnected = true;
                    self.server.disconnect(self);
                }
            }, 1);
        }
    }
}
