module.exports = {
    PART(user, channelName, partMessage) {
        // TODO: this.server can accept multiple channels according to the spec
        const channel = user.server.channels.find(channelName);
        if (channel && user.channels.indexOf(channel) !== -1) {
            partMessage = partMessage ? ' :' + partMessage : '';
            channel.send(user.mask, 'PART', channelName + partMessage);
            channel.part(user);
            if (channel.users.length === 0) {
                user.server.channels.remove(channel);
            }
        }
    }
}
