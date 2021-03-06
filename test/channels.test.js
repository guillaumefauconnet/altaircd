const assert = require('assert');
const helpers = require('./helpers');

describe('Channels', function () {
    beforeEach(function (done) {
        this.server = new helpers.MockServer(done, false, 6660);
    });

    afterEach(function (done) {
        this.server.close(done);
    });
    // @TODO : repair this tests
    /*
    it('test rejoin', function (done) {
        var createClient = this.server.createClient.bind(this.server);

        // Create two clients
        createClient({ nick: 'testbot1', channel: '#test' }, function (testbot1) {
            createClient({ nick: 'testbot2', channel: '#test' }, function (testbot2) {

                var i = 0;
                testbot2.on('raw', function (data) {
                    switch (data.command) {
                        case 'rpl_namreply':
                            var names = data.args[3].split(' ').filter(function (f) {
                                return f.match(/testbot/);
                            });
                            assert.equal(2, names.length);
                            i++;
                            if (i === 1) {
                                testbot2.part('#test');
                            } else {
                                testbot1.disconnect();
                                testbot2.disconnect();
                                done();
                            }
                            break;
                        case 'PART':
                            testbot2.join('#test');
                            break;
                    }
                });
            });
        });
    });

    it('test bad join (#22)', function (done) {
        // Create two clients
        var createClient = this.server.createClient.bind(this.server);

        createClient({ nick: 'testbot1', channel: '#test' }, function (testbot1) {
            createClient({ nick: 'testbot2', channel: '#test' }, function (testbot2) {

                testbot1.on('error', function (message) {
                    if (message.command === 'err_needmoreparams') {
                        testbot1.disconnect();
                        testbot2.disconnect();
                        done();
                    }
                });

                testbot1.on('raw', function (data) {
                    if (data.command === 'JOIN') {
                        testbot1.send('join');
                    }
                });
            });
        });
    });

    it('test messaging a non-existent channel (#26)', function (done) {
        var createClient = this.server.createClient.bind(this.server);

        // Create two clients
        createClient({ nick: 'testbot1', channel: '#test' }, function (testbot1) {
            createClient({ nick: 'testbot2', channel: '#test' }, function (testbot2) {
                testbot1.on('error', function (message) {
                    if (message.command === 'err_nosuchnick') {
                        testbot1.disconnect();
                        testbot2.disconnect();
                        done();
                    }
                });

                testbot1.say('#error', 'Hello');
            });
        });
    });

    it('remove channels when the last person leaves (#25)', function (done) {
        var createClient = this.server.createClient.bind(this.server);

        // Create two clients
        createClient({ nick: 'testbot1', channel: '#test' }, function (testbot1) {
            function teardown() {
                testbot1.disconnect();
                done();
            }

            var seenList = false;

            testbot1.on('raw', function (data) {
                // Double equal, because this is returned as a string but could easily
                // be returned as an integer if the IRC client library changes
                if (data.rawCommand == 322) {
                    if (seenList) {
                        assert.fail('Channels should be deleted');
                    } else {
                        assert.equal(data.args[1], '#test', 'The #test channel should be returned by LIST');

                        // Now part the channel
                        testbot1.part('#test');
                    }
                } else if (data.rawCommand == 323 && !seenList) {
                    seenList = true;
                } else if (data.rawCommand == 323 && seenList) {
                    teardown();
                } else if (data.command === 'PART') {
                    testbot1.send('LIST');
                }
            });

            // Send a list command
            testbot1.send('LIST');
        });
    });

    it('simultaneous user simulation', function (done) {
        var nicks = [], i;

        for (i = 1; i <= 100; i++) {
            nicks.push('user_' + i);
        }

        function assertReceive(bots, assertion, fn) {
            bots[0].say(bots[1].nick, assertion);

            var callback = function (from, to, message) {
                assert.equal(assertion, message);
                bots[1].removeListener('message', callback);
                fn();
            };

            bots[1].on('message', callback);
        }

        this.server.createClients(nicks, '#test', function (bots) {
            function teardown() {
                bots.forEach(function (bot) {
                    bot.disconnect();
                });
                done();
            }

            var tested = 0, max = bots.length - 1;
            for (var i = 0; i < max; i++) {
                assertReceive([bots[i], bots[i + 1]], 'Message ' + Math.random(), function () {
                    tested++;
                    if (tested === max) {
                        teardown();
                    }
                });
            }
        });
    });

    it('test join with invalid key', function (done) {
        var createClient = this.server.createClient.bind(this.server);

        createClient({ nick: 'testbot1', channel: '#test' }, function (testbot1) {
            // Set the channel key to 'test'
            testbot1.send('MODE #test +k test');
            testbot1.on('raw', function (data) {
                if (data.rawCommand === '324') {
                    createClient({ nick: 'testbot2', channel: '#test2' }, function (testbot2) {
                        testbot2.on('error', function (message) {
                            assert.equal(message.rawCommand, '475', 'Should receive a bad channel key');
                            testbot1.disconnect();
                            testbot2.disconnect();

                            done();
                        });

                        // Join without the correct key
                        testbot2.send('JOIN #test');
                    });
                }
            });
        });
    });

    it('test join with valid key', function (done) {
        var createClient = this.server.createClient.bind(this.server);

        createClient({ nick: 'testbotv', channel: '#test' }, function (testbot1) {
            // Set the channel key to 'password'
            testbot1.send('MODE #test +k password');
            testbot1.on('raw', function (data) {
                if (data.rawCommand === '324') {
                    createClient({ nick: 'testbot2', channel: '#test password' }, function (testbot2) {
                        testbot2.on('raw', function (data) {
                            if (data.rawCommand === '324') {
                                testbot1.disconnect();
                                testbot2.disconnect();
                                done();
                            }
                        });
                    });
                }
            });
        });
    });*/
});
