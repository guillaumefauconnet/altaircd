const channelMode = require('./channel/mode');
const channelBan = require('./channel/ban');
const channelInvite = require('./channel/invite');
const channelSend = require('./channel/send');

class Channel {
    constructor(name, ircServer) {
        this.server = ircServer;
        this.name = name;
        this.users = [];
        this.topic = '';
        this._modes = ['n', 't', 'r'];
        this.banned = [];
        this.userLimit = 0;
        this.key = null;
        this.inviteList = [];
    }

    get modes() {
        return '+' + this._modes.join('');
    }

    set modes(modes) {
        this._modes = modes.split('');
    }

    get memberCount() {
        return this.users.length;
    }

    get isLimited() {
        return this._modes.indexOf('l') > -1;
    }

    get isPublic() {
        return !this.isSecret && !this.isPrivate;
    }

    get isSecret() {
        return this._modes.indexOf('s') > -1;
    }

    get isPrivate() {
        return this._modes.indexOf('p') > -1;
    }

    get isModerated() {
        return this._modes.indexOf('m') > -1;
    }

    get isInviteOnly() {
        return this._modes.indexOf('i') > -1;
    }

    get names() {
        const channel = this;
        return this.users.map(function (user) {
            return user.channelNick(channel);
        }).join(' ');
    }

    get type() {
        if (this.isPrivate) {
            return '*';
        } else if (this.isSecret) {
            return '@';
        } else {
            return '=';
        }
    }

    part(user) {
        this.users.splice(this.users.indexOf(user), 1);
        user.channels.splice(user.channels.indexOf(this), 1);
        delete user.channelModes[this];
    }

    isMember(user) {
        return this.users.indexOf(user) !== -1;
    }
}

Object.assign(Channel.prototype, channelMode);
Object.assign(Channel.prototype, channelBan);
Object.assign(Channel.prototype, channelInvite);
Object.assign(Channel.prototype, channelSend);

module.exports = Channel;
