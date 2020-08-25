const Channel = require('../channel');

module.exports = {
    createDefaultChannels(server) {
        const self = server;
        if (server.config.channels) {
            Object.keys(server.config.channels).forEach((channel) => {
                let channelName = '';
                if (!self.channelTarget(channel)) {
                    channelName = "#" + channel;
                } else {
                    channelName = channel;
                }
                const newChannel = self.channels.registered[self.normalizeName(channelName)] = new Channel(channelName, self);
                newChannel.topic = self.config.channels[channel].topic;
            });
        }
    },

    //make sure the channel name is valid as per RFC 2813
    channelTarget(target) {
        const prefix = target[0];
        const channelPrefixes = ['#', '&', '!', '+'];
        return (channelPrefixes.indexOf(prefix) !== -1);
    }
}
