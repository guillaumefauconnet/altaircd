const assert = require('assert');
const net = require('net');
const helpers = require('./helpers');

describe('Sockets', function () {
    beforeEach(function (done) {
        this.server = new helpers.MockServer(done, false, 6663);
    });

    afterEach(function (done) {
        this.server.close(done);
    });

    it('test destroy a socket', function (done) {
        const server = this.server.server;
        const bob = net.createConnection(server.config.port, server.config.hostname);

        bob.write('garbage');
        process.nextTick(function () {
            bob.destroy();
            done();
        });
    });

    it('test send garbage', function (done) {
        const server = this.server.server;
        const alice = net.createConnection(server.config.port, server.config.hostname);

        alice.write('NICK alice\n\x00\x07abc\r\uAAAA', 'ascii', function () {
            alice.end();
        });
        
        done();
    });
});

