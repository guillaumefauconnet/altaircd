const assert = require('assert');
const path = require('path');
const User = require(path.join(__dirname, '..', 'lib', 'user'));

describe('User', function () {
    it('test timeout calculation', function (done) {
        const server = {
            config: { idleTimeout: 60 }
        };
        
        const user = new User(null, server);

        assert.ok(!user.hasTimedOut());
        user.lastPing = (Date.now() - 61000);
        assert.ok(user.hasTimedOut());

        done();
    })
})
