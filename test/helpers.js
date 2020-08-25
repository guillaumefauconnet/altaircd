const path = require('path');
const Server = require(path.join(__dirname, '..', 'lib', 'server')).Server;
// @TODO : find alt irc client or find solution for use this with recent npm version (nvm ?)
//const irc = require('irc');
const winston = require('winston');

winston.remove(winston.transports.Console);

class MockServer {
    constructor(done, usepass, port) {
        this.server = new Server();
        this.server.showLog = false;
        this.server.config = {
            'network': 'ircn',
            'hostname': 'localhost',
            'serverDescription': 'A Node IRC daemon',
            'serverName': 'server',
            'port': port,
            'linkPort': 7777,
            'whoWasLimit': 10000,
            'token': 1,
            'opers': {},
            'links': {}
        };

        if (usepass) {
            this.server.config.serverPassword = '$2a$10$T1UJYlinVUGHqfInKSZQz./CHrYIVVqbDO3N1fRNEUvFvSEcshNdC';
        }

        this.server.start(done);
    }

    close(done) {
        this.server.close(done);
    };

    createClient(options, fn) {
        options.port = this.server.config.port;

        let ranCallback = false;
        /*const client = new irc.Client('localhost', options.nick, {
                channels: [options.channel]
                , port: options.port
                , debug: false
                , password: options.password
        });

        client.addListener('join', function () {
            if (!ranCallback) {
                fn(client);
                ranCallback = true;
            }
        });*/
    };

    createClients(nicks, channel, fn) {
        /*var connected = []
            , createClient = this.createClient.bind(this);

        nicks.forEach(function (nick) {
            createClient({ nick: nick, channel: channel }, function (bot) {
                connected.push(bot);
                if (connected.length == nicks.length) {
                    fn(connected);
                }
            });
        });*/
    };
}

module.exports = {
    MockServer: MockServer,
    createServer: function (usepass, port, fn) {
        var server = new MockServer(function () { fn(server); }, usepass, port);
    }
};
