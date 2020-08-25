const protocol = require('../protocol');

module.exports = {
    findUserNamed(nick) {
        nick = this.server.normalizeName(nick);
        for (let i = 0; i < this.users.length; i++) {
            if (this.server.normalizeName(this.users[i].nick) === nick) {
                return this.users[i];
            }
        }
    },

    addModes(user, modes, arg) {
        const channel = this;
        modes.slice(1).split('').forEach(function (mode) {
            if (channel.addMode[mode])
                channel.addMode[mode].apply(channel, [user, arg]);
        });
    },

    removeModes(user, modes, arg) {
        const channel = this;
        modes.slice(1).split('').forEach(function (mode) {
            if (channel.removeMode[mode])
                channel.removeMode[mode].apply(channel, [user, arg]);
        });
    },

    opModeAdd(mode, user, arg) {
        if (user.isOp(this)) {
            if (this.modes.indexOf(mode) === -1) {
                this.modes += mode;
                this.send(user.mask, 'MODE', this.name, '+' + mode, this.name);
                return true;
            }
        } else {
            user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
        }
        return false;
    },

    opModeRemove(mode, user, arg) {
        if (user.isOp(this)) {
            if (this.modes.indexOf(mode) !== -1) {
                this.modes = this.modes.replace(mode, '');
                this.send(user.mask, 'MODE', this.name, '-' + mode, this.name);
                return true;
            }
        } else {
            user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
        }
        return false;
    },

    addMode: {
        o: function (user, arg) {
            if (user.isOp(this)) {
                const targetUser = this.findUserNamed(arg);
                if (targetUser && !targetUser.isOp(this)) {
                    targetUser.op(this);
                    this.send(user.mask, 'MODE', this.name, '+o', targetUser.nick);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        h: function (user, arg) {
            if (user.isOp(this)) {
                const targetUser = this.findUserNamed(arg);
                if (targetUser && !targetUser.isHop(this)) {
                    targetUser.hop(this);
                    this.send(user.mask, 'MODE', this.name, '+h', targetUser.nick);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        v: function (user, arg) {
            if (user.isHop(this)) {
                const targetUser = this.findUserNamed(arg);
                if (targetUser && !targetUser.isVoiced(this)) {
                    targetUser.voice(this);
                    this.send(user.mask, 'MODE', this.name, '+v', targetUser.nick);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're must be at least half-op to do that!");
            }
        },

        i: function (user, arg) {
            this.opModeAdd('i', user, arg);
        },

        k: function (user, arg) {
            if (user.isOp(this)) {
                if (this.key) {
                    user.send(this.server.host, protocol.errors.keySet, user.nick, this.name, ":Channel key already set");
                } else if (this.isValidKey(arg)) {
                    this.key = arg;
                    this.modes += 'k';
                    this.send(user.mask, 'MODE', this.name, '+k ' + arg);
                } else {
                    // TODO: I thought 475 was just returned when joining the channel
                    user.send(this.server.host, protocol.errors.badChannelKey, user.nick, this.name, ":Invalid channel key");
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        l: function (user, arg) {
            if (user.isOp(this)) {
                if (this.server.isValidPositiveInteger(arg)) {
                    const limit = parseInt(arg, 10);
                    if (this.userLimit != limit) {
                        this.modes += 'l';
                        this.userLimit = limit;
                        this.send(user.mask, 'MODE', this.name, '+l ' + arg, this.name);
                    }
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        m: function (user, arg) {
            this.opModeAdd('m', user, arg);
        },

        n: function (user, arg) {
            this.opModeAdd('n', user, arg);
        },

        t: function (user, arg) {
            this.opModeAdd('t', user, arg);
        },

        p: function (user, arg) {
            this.opModeAdd('p', user, arg);
        },

        s: function (user, arg) {
            this.opModeAdd('s', user, arg);
        },

        b: function (user, arg) {
            if (user.isOp(this)) {
                // TODO: Valid ban mask?
                if (!arg || arg.length === 0) {
                    user.send(this.server.host, protocol.errors.needMoreParams, user.nick, this.name, ":Please enter ban mask");
                } else if (!this.banMaskExists(arg)) {
                    this.banned.push({ user: user, mask: arg, timestamp: (new Date()).valueOf() });
                    this.send(user.mask, 'MODE', this.name, '+b', ':' + arg);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        }
    },

    removeMode: {
        o: function (user, arg) {
            if (user.isOp(this)) {
                const targetUser = this.findUserNamed(arg);
                if (targetUser && targetUser.isOp(this)) {
                    targetUser.deop(this);
                    this.send(user.mask, 'MODE', this.name, '-o', targetUser.nick);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        v: function (user, arg) {
            if (user.isOp(this)) {
                const targetUser = this.findUserNamed(arg);
                if (targetUser && targetUser.isVoiced(this)) {
                    targetUser.devoice(this);
                    this.send(user.mask, 'MODE', this.name, '-v', targetUser.nick);
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        },

        i: function (user, arg) {
            this.opModeRemove('i', user, arg);
        },

        k: function (user, arg) {
            if (this.opModeRemove('k', user, arg)) {
                this.key = null;
            }
        },

        l: function (user, arg) {
            if (this.opModeRemove('l', user, arg, ' ' + arg)) {
                this.userLimit = 0;
            }
        },

        m: function (user, arg) {
            this.opModeRemove('m', user, arg);
        },

        n: function (user, arg) {
            this.opModeRemove('n', user, arg);
        },

        t: function (user, arg) {
            this.opModeRemove('t', user, arg);
        },

        p: function (user, arg) {
            this.opModeRemove('p', user, arg);
        },

        s: function (user, arg) {
            this.opModeRemove('s', user, arg);
        },

        b: function (user, arg) {
            if (user.isOp(this)) {
                // TODO: Valid ban mask?
                if (!arg || arg.length === 0) {
                    user.send(this.server.host, protocol.errors.needMoreParams, user.nick, this.name, ":Please enter ban mask");
                } else {
                    const ban = this.findBan(arg);
                    if (ban) {
                        this.banned.splice(this.banned.indexOf(ban), 1);
                        this.send(user.mask, 'MODE', this.name, '-b', ':' + arg);
                    }
                }
            } else {
                user.send(this.server.host, protocol.errors.channelOpsReq, user.nick, this.name, ":You're not channel operator");
            }
        }
    },

    isValidKey(key) {
        return key && key.length > 1 && key.length < 9 && !key.match(protocol.validations.invalidChannelKey);
    },
}
