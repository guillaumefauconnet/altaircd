const dns = require('dns')

const userMode = require('./user/mode');
const userStatus = require('./user/status');
const userSend = require('./user/send');
const userMask = require('./user/mask');
const userChannel = require('./user/channel');
const userRegister = require('./user/register');
const userMessage = require('./user/message');

class User {
    constructor(client, ircServer) {
        this.server = ircServer;
        this.config = ircServer.config;
        this.nick = null;
        this.username = null;
        this.realname = null;
        this.channels = [];
        this.quitMessage = 'Connection lost';
        this.disconnected = false;
        this.pendingAuth = false;
        this.passwordAccepted = false;
        this.lastPing = null;
        this.postAuthQueue = [];

        if (client) {
            this.client = client;
        }

        if (client && client.stream) {
            this.stream = client.stream;
            this.remoteAddress = client.stream.remoteAddress;
            this.hostname = client.stream.remoteAddress;
        }

        this.registered = false;
        this._modes = [];
        this.channelModes = {};
        this.serverName = '';
        this.created = new Date() / 1000;
        this.updated = new Date();
        this.isAway = false;
        this.awayMessage = null;
        this.serverOper = false;
        this.localOper = false;
        this.hopCount = 0;
        this.servertoken = null;

        this.hostLookup();
    }

    get id() {
        return this.nick;
    }

    get mask() {
        return ':' + this.nick + '!' + this.username + '@' + this.hostname;
    }

    get modes() {
        return '+' + this._modes.join('');
    }

    set modes(modes) {
        if (modes) {
            modes = modes.replace(/^\+/, '');
            this._modes = modes.split('');
        }
    }

    get idle() {
        return parseInt(((new Date()) - this.updated) / 1000, 10);
    }

    get isOper() {
        return this.modes.indexOf('o') !== -1;
    }

    get isInvisible() {
        return this.modes.indexOf('i') !== -1;
    }

    hostLookup() {
        if (!this.remoteAddress) return;
        const user = this;
        dns.reverse(this.remoteAddress, function (err, addresses) {
            user.hostname = addresses && addresses.length > 0 ? addresses[0] : user.remoteAddress;
        });
    }

    queue(message) {
        this.postAuthQueue.push(message);
    }

    runPostAuthQueue() {
        if (!this.passwordAccepted) return;

        const self = this;

        this.postAuthQueue.forEach(function (message) {
            self.server.respondToMessage(self, message);
        });
    }

    hasTimedOut() {
        return this.lastPing && (Math.floor((Date.now() - this.lastPing) / 1000) > (this.config.pingTimeout || this.config.idleTimeout));
    }

    closeStream() {
        if (this.stream && this.stream.end) {
            this.stream.end();
        }
    }

    quit(message) {
        this.quitMessage = message;
        this.closeStream();
    }
}

Object.assign(User.prototype, userMode);
Object.assign(User.prototype, userStatus);
Object.assign(User.prototype, userSend);
Object.assign(User.prototype, userMask);
Object.assign(User.prototype, userChannel);
Object.assign(User.prototype, userRegister);
Object.assign(User.prototype, userMessage);

module.exports = User;
