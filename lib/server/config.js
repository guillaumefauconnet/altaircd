const path = require('path');
const winston = require('winston');
const fs = require('fs');
const exists = fs.exists || path.exists; // 0.8 moved exists to fs

module.exports = {
    loadConfig(fn) {
        const server = this;
        const paths = [
            path.join('/', 'etc', 'ircdjs', 'config.json'),
            path.join(__dirname, '..', '..', 'config', 'config.json')
        ];

        this.config = null;
        if (server.file) paths.unshift(server.file);

        paths.forEach(function (name) {
            exists(name, function (exists) {
                if (!exists || server.config) return;
                //try {
                server.config = JSON.parse(fs.readFileSync(name).toString());
                server.config.idleTimeout = server.config.idleTimeout || 60;
                winston.info('Using config file: ' + name);
                if (fn) fn();
                //} catch (exception) {
                //    winston.error('Please ensure you have a valid config file.', exception);
                //}
            });
        });
    }
}
