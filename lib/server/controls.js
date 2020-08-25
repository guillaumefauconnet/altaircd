const net = require('net');
const tls = require('tls');
const carrier = require('carrier');
const fs = require('fs');
const winston = require('winston');
const assert = require('assert');
const WebSocket = require('ws');
const AbstractConnection = require('./AbstractConnection');
const User = require('../user');

module.exports = {
    start(callback) {
        const server = this;
        let key, cert, options;

        if (this.config.key && this.config.cert) {
            try {
                key = fs.readFileSync(this.config.key);
                cert = fs.readFileSync(this.config.cert);
            } catch (exception) {
                winston.error('Fatal error:', exception);
            }
            options = { key: key, cert: cert };
            this.server = tls.createServer(options, handleStream);
        } else {
            this.server = net.createServer(handleStream);
        }

        assert.ok(callback === undefined || typeof callback == 'function');
        this.server.listen(this.config.port, callback);
        winston.info('Server listening on port: ' + this.config.port);

        //Add websocket support 
        const wss = new WebSocket.Server({ port: this.config.wsport });

        wss.on('connection', (ws) => {
            const client = new AbstractConnection(ws);
            client.object = new User(client, server);

            ws.on('message', (message) => {
                const line = message.slice(0, 512);
                this.respond(line, client);
                console.log('WebSocket: %s', message);
            });

            //ws.send('something');
        });

        this.startTimeoutHandler();

        function handleStream(stream) {
            try {
                const carry = carrier.carry(stream);
                const client = new AbstractConnection(stream);

                client.object = new User(client, server);
                if (server.config.serverPassword) {
                    client.object.pendingAuth = true;
                }

                stream.on('end', function () { server.end(client); });
                stream.on('error', winston.error);
                carry.on('line', function (line) { server.data(client, line); });
            } catch (exception) {
                winston.error('Fatal error:', exception);
            }
        }
    },

    close(callback) {
        if (callback !== undefined) {
            assert.ok(typeof callback === 'function');
            this.server.once('close', callback);
        }
        this.stopTimeoutHandler();
        this.server.close();
    },

    startTimeoutHandler() {
        const self = this;
        const timeout = this.config.pingTimeout || 10;
        this.timeoutHandler = setInterval(function () {
            self.users.forEach(function (user) {
                if (user.hasTimedOut()) {
                    winston.info('User timed out:', user.mask);
                    self.disconnect(user);
                } else {
                    // TODO: If no other activity is detected
                    user.send('PING', self.config.hostname, self.host);
                }
            });
        }, timeout * 1000);
    },

    stopTimeoutHandler() {
        clearInterval(this.timeoutHandler);
    },

    end(client) {
        const user = client.object;

        if (user) {
            this.disconnect(user);
        }
    },

    disconnect(user) {
        user.channels.forEach(function (channel) {
            channel.users.forEach(function (channelUser) {
                if (channelUser !== user) {
                    channelUser.send(user.mask, 'QUIT', user.quitMessage);
                }
            });

            channel.users.splice(channel.users.indexOf(user), 1);
        });

        user.closeStream();
        this.users.remove(user);
        user = null;
    },

    data(client, line) {
        line = line.slice(0, 512);
        console.log('Winston: %s', line);
        winston.info('[' + this.name + ', C: ' + client.id + '] ' + line);
        this.respond(line, client);
    }
}
