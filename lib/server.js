//
// AltaIrcd

// libs:
// http://github.com/pgte/carrier

// rfcs:
// http://www.networksorcery.com/enp/rfc/rfc2812.txt
// http://tools.ietf.org/html/rfc1459
//
// spells out some stuff the RFC was light on:
// http://docs.dal.net/docs/misc.html#5

const winston = require('winston');

const ChannelDatabase = require('./storage/ChannelDatabase');
const UserDatabase = require('./storage/UserDatabase');
const History = require('./storage/History');
const ServerCommands = require('./commands');
const serverChannels = require('./server/channels');
const serverControls = require('./server/controls.js');
const serverHelpers = require('./server/helpers');
const serverResponses = require('./server/responses');
const serverCli = require('./server/cli');
const serverMotd = require('./server/motd');
const serverConfig = require('./server/config');

class Server {
    constructor() {
        this.history = new History(this);
        this.users = new UserDatabase(this);
        this.channels = new ChannelDatabase(this);
        this.config = null;
        this.commands = new ServerCommands(this);
    }

    get version() {
        return '0.0.17';
    }

    get created() {
        return '2012-09-21';
    }

    get debug() {
        return false;
    }

    get name() {
        return this.config.serverName;
    }

    get info() {
        return this.config.serverDescription;
    }

    get token() {
        return this.config.token;
    }

    get host() {
        return ':' + this.config.hostname;
    }

    static boot() {
        var server = new Server();
        server.file = server.cliParse();
        server.loadConfig(function () {
            server.start();
            server.createDefaultChannels(server);
        });
        process.on('SIGHUP', function () {
            winston.info('Reloading config...');
            server.loadConfig();
        });
        process.on('SIGTERM', function () {
            winston.info('Exiting...');
            server.close();
        });
    }
}

Object.assign(Server.prototype, serverChannels);
Object.assign(Server.prototype, serverControls);
Object.assign(Server.prototype, serverHelpers);
Object.assign(Server.prototype, serverResponses);
Object.assign(Server.prototype, serverCli);
Object.assign(Server.prototype, serverMotd);
Object.assign(Server.prototype, serverConfig);

exports.Server = Server;
exports.winston = winston;

if (!module.parent) {
    Server.boot();
}
