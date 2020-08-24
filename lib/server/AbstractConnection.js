class AbstractConnection {
    constructor(stream) {
        this.stream = stream;
        this.object = null;
        this.__defineGetter__('id', function () {
            return this.object ? this.object.id : 'Unregistered';
        });
    }
}

module.exports = AbstractConnection;
