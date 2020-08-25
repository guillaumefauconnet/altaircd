module.exports = {
    expandMask(mask) {
        return mask.replace(/\./g, '\\.').
            replace(/\*/g, '.*');
    },

    matchesMask(mask) {
        let parts = mask.match(/([^!]*)!([^@]*)@(.*)/) || [],
            matched = true,
            lastPart = parts.length < 4 ? parts.length : 4;
        parts = parts.slice(1, lastPart).map(this.expandMask);

        if (!this.nick.match(parts[0])) {
            return false;
        } else if (!this.username.match(parts[1])) {
            return false;
        } else if (!this.hostname.match(parts[2])) {
            return false;
        } else {
            return true;
        }
    }
}
