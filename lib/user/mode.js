const protocol = require('../protocol');

module.exports = {
    addModes(user, modes, arg) {
        const thisUser = this;
        modes.slice(1).split('').forEach(function (mode) {
            if (thisUser.addMode[mode])
                thisUser.addMode[mode].apply(thisUser, [user, arg]);
        });
    },

    addMode: {
        i: function (user, arg) {
            if (this.isOper || this === user) {
                if (!user.modes.match(/i/)) {
                    user._modes.push('i');
                    user.send(user.mask, 'MODE', this.nick, '+i', user.nick);
                    if (this !== user) {
                        this.send(this.mask, 'MODE', this.nick, '+i', user.nick);
                    }
                }
            } else {
                this.send(this.server.host, protocol.errors.usersDoNotMatch, this.nick, user.nick, ':Cannot change mode for other users');
            }
        },

        o: function () {
            // Can only be issued by OPER
        },

        w: function () {
            if (!this.modes.match(/w/)) {
                this._modes.push('w');
                this.send(this.mask, 'MODE', this.nick, '+w', this.nick);
            }
        }
    },

    removeModes(user, modes, arg) {
        const thisUser = this;
        modes.slice(1).split('').forEach(function (mode) {
            if (thisUser.removeMode[mode])
                thisUser.removeMode[mode].apply(thisUser, [user, arg]);
        });
    },

    removeMode: {
        i: function (user, arg) {
            if (this.isOper || this === user) {
                if (user.modes.match(/i/)) {
                    user._modes.splice(user._modes.indexOf('i'), 1);
                    user.send(user.mask, 'MODE', this.nick, '-i', user.nick);
                    if (this !== user) {
                        this.send(this.mask, 'MODE', this.nick, '-i', user.nick);
                    }
                }
            } else {
                this.send(this.server.host, protocol.errors.usersDoNotMatch, this.nick, user.nick, ':Cannot change mode for other users');
            }
        },

        o: function () {
            if (this.modes.match(/o/)) {
                user._modes.splice(user._modes.indexOf('o'), 1);
                this.send(this.mask, 'MODE', this.nick, '-o', this.nick);
            }
        },

        w: function () {
            if (this.modes.match(/w/)) {
                user._modes.splice(user._modes.indexOf('w'), 1);
                this.send(this.mask, 'MODE', this.nick, '-w', this.nick);
            }
        }
    }
}
