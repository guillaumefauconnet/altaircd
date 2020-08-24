module.exports = {
    validCommand(command) {
        return this.commands[command];
    },

    parse(data) {
        let parts = data.trim().split(/ :/);
        const args = parts[0].split(' ');

        parts = [parts.shift(), parts.join(' :')];

        if (parts.length > 0) {
            args.push(parts[1]);
        }

        if (data.match(/^:/)) {
            args[1] = args.splice(0, 1, args[1]);
            args[1] = (args[1] + '').replace(/^:/, '');
        }

        return {
            command: args[0].toUpperCase(),
            args: args.slice(1)
        };
    },

    normalizeName(name) {
        return name &&
            name.toLowerCase()
                .replace(/{/g, '[')
                .replace(/}/g, ']')
                .replace(/\|/g, '\\')
                .trim();
    },

    isValidPositiveInteger(str) {
        const n = ~~Number(str);
        return String(n) === str && n >= 0;
    },

    valueExists(value, collection, field) {
        const self = this;
        value = this.normalizeName(value);
        return collection.some(function (u) {
            return self.normalizeName(u[field]) === value;
        })
    }
}
