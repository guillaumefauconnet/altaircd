module.exports = {
    sharedChannelWith(targetUser) {
        const user = this;
        const channels = targetUser.channels;
        let matchedChannel;
        
        channels.some(function (channel) {
            if (user.channels.indexOf(channel) !== -1) {
                matchedChannel = channel;
                return true;
            }
        });

        return matchedChannel;
    },

    // TODO: Voice
    channelNick(channel) {
        return this.isOp(channel) ? '@' + this.nick : this.nick;
    }
}
