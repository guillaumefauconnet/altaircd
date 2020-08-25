const Channel = require('../channel').Channel;
const irc = require('../protocol');

class ChannelDatabase {
    constructor(server) {
        this.server = server;
        this.registered = {};
    }

    message(user, channel, message) {
        if (!channel) return;
        channel.users.forEach(function (channelUser) {
            if (channelUser !== user) {
                channelUser.send(user.mask, 'PRIVMSG', channel.name, ':' + message);
            }
        });
    }

    expandMask(mask) {
        return mask.replace(/\./g, '\\.').
            replace(/\*/g, '.*');
    }

    findWithMask(channelMask) {
        channelMask = this.expandMask(this.server.normalizeName(channelMask));
        for (var channelName in this.registered) {
            if (channelMask.match(channelName.replace(/\+/g, '\\+'))) {
                return this.registered[channelName];
            }
        }
    }

    find(channelName) {
        return this.registered[this.server.normalizeName(channelName)];
    }

    join(user, channelName, key) {
        // TODO: valid channel name?
        // Channels names are strings (beginning with a '&' or '#' character) of
        // length up to 200 characters.  Apart from the the requirement that the
        // first character being either '&' or '#'; the only restriction on a
        // channel name is that it may not contain any spaces (' '), a control G
        // (^G or ASCII 7), or a comma (',' which is used as a list item
        // separator by the protocol).

        var channel = this.find(channelName);

        if (!channel) {
            channel = this.registered[this.server.normalizeName(channelName)] = new Channel(channelName, this.server);
        }

        if (channel.isMember(user)) {
            return;
        }

        if (channel.isInviteOnly && !channel.onInviteList(user)) {
            user.send(this.server.host, irc.errors.inviteOnly, user.nick, channel.name, ':Cannot join channel (+i)');
            return;
        }

        if (channel.isBanned(user)) {
            user.send(this.server.host, irc.errors.banned, user.nick, channel.name, ':Cannot join channel (+b)');
            return;
        }

        if (channel.isLimited && channel.users.length >= channel.userLimit) {
            user.send(this.server.host, irc.errors.channelIsFull, user.nick, channel.name, ':Channel is full.');
            return;
        }

        if (channel.key) {
            if (key !== channel.key) {
                user.send(this.server.host, irc.errors.badChannelKey, user.nick, this.name, ":Invalid channel key");
                return;
            }
        }

        if (channel.users.length === 0) {
            user.op(channel);
        }

        channel.users.push(user);
        user.channels.push(channel);

        channel.users.forEach(function (channelUser) {
            channelUser.send(user.mask, 'JOIN', channel.name);
        });

        if (channel.topic) {
            user.send(this.server.host, irc.reply.topic, user.nick, channel.name, ':' + channel.topic);
        } else {
            user.send(this.server.host, irc.reply.noTopic, user.nick, channel.name, ':No topic is set');
        }

        user.send(this.server.host, irc.reply.nameReply, user.nick, channel.type, channel.name, ':' + channel.names);
        user.send(this.server.host, irc.reply.endNames, user.nick, channel.name, ':End of /NAMES list.');
    }

    remove(channel) {
        delete this.registered[channel.name];
    }
}

module.exports = ChannelDatabase;
