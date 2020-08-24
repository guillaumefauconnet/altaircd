const away = require('./commands/away');
const invite = require('./commands/invite');
const join = require('./commands/join');
const kick = require('./commands/kick');
const list = require('./commands/list');
const mode = require('./commands/mode');
const motd = require('./commands/motd');
const names = require('./commands/names');
const nick = require('./commands/nick');
const oper = require('./commands/oper');
const part = require('./commands/part');
const pass = require('./commands/pass');
const pong = require('./commands/pong');
const ping = require('./commands/ping');
const privmsg = require('./commands/privmsg');
const quit = require('./commands/quit');
const time = require('./commands/time');
const topic = require('./commands/topic');
const user = require('./commands/user');
const version = require('./commands/version');
const wallops = require('./commands/wallops');
const who = require('./commands/who');
const whois = require('./commands/whois');
const whowas = require('./commands/whowas');

class Commands {
    constructor(server) {
        this.server = server;
    }
}

Object.assign(Commands.prototype, away);
Object.assign(Commands.prototype, invite);
Object.assign(Commands.prototype, join);
Object.assign(Commands.prototype, kick);
Object.assign(Commands.prototype, list);
Object.assign(Commands.prototype, mode);
Object.assign(Commands.prototype, motd);
Object.assign(Commands.prototype, names);
Object.assign(Commands.prototype, nick);
Object.assign(Commands.prototype, oper);
Object.assign(Commands.prototype, part);
Object.assign(Commands.prototype, pass);
Object.assign(Commands.prototype, pong);
Object.assign(Commands.prototype, ping);
Object.assign(Commands.prototype, privmsg);
Object.assign(Commands.prototype, quit);
Object.assign(Commands.prototype, time);
Object.assign(Commands.prototype, topic);
Object.assign(Commands.prototype, user);
Object.assign(Commands.prototype, version);
Object.assign(Commands.prototype, wallops);
Object.assign(Commands.prototype, who);
Object.assign(Commands.prototype, whois);
Object.assign(Commands.prototype, whowas);

module.exports = Commands;
