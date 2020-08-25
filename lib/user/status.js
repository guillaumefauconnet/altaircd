module.exports = {
    oper() {
        if (!this.modes.match(/o/)) {
            this._modes.push('o');
            this.send(this.mask, 'MODE', this.nick, '+o', this.nick);
            this.localOper = true;
        }
    },

    deoper() {
        this.removeMode.o.apply(this);
        this.localOper = false;
    },

    isOp(channel) {
        if (this.channelModes[channel])
            return this.channelModes[channel].match(/o/);
    },

    op(channel) {
        this.channelModes[channel] += 'o';
    },

    deop(channel) {
        if (this.channelModes[channel])
            this.channelModes[channel] = this.channelModes[channel].replace(/o/, '');
    },

    isHop(channel) {
        if (this.channelModes[channel])
            return this.channelModes[channel].match(/h/) || this.isOp(channel);
    },

    hop(channel) {
        this.channelModes[channel] += 'h';
    },

    dehop(channel) {
        if (this.channelModes[channel])
            this.channelModes[channel] = this.channelModes[channel].replace(/h/, '');
    },

    isVoiced(channel) {
        if (this.channelModes[channel])
            return this.channelModes[channel].match(/v/) || this.isHop(channel) || this.isOp(channel);
    },

    voice(channel) {
        this.channelModes[channel] += 'v';
    },

    devoice(channel) {
        if (this.channelModes[channel])
            this.channelModes[channel] = this.channelModes[channel].replace(/v/, '');
    }
}
