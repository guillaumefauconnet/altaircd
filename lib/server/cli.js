const commander = require('commander');

module.exports = {
    cliParse() {
        let file = null;

        commander.option('-f --file [file]', 'Configuration file (Defaults: /etc/ircdjs/config.json or ../config/config.json)')
            .parse(process.argv);
        // When the -f switch is passwd without a parameter, commander.js evaluates it to true.
        if (commander.file && commander.file !== true) file = commander.file;
        return file;
    }
}
