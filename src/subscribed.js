function array(array) {
    this.contains = (compare) => {
        for (var i = 0; i < compare.length; i++) {
            if (!array.includes(compare[i])) {
                return false;
            }
        }
        return true;
    }
    this.toMap = () => {
        let map = new Map();
        array.forEach((part) => {
            map.set(part.name, part);
        });
        return map;
    }
}

class Subscribed {
    /**
     * Subcribed event class
     * @param {event[]} events
     */
    constructor(events) {
        events.forEach((event) => {
            if (!array(Object.keys(event)).contains(["name", "arguments"])) {
                throw new Error("Missing argument in event type " + event.name);
            }
        });
        this._events = array(events).toMap();
    }

    subscribe(event, fn) {
        if (this._events.has(event)) {
            let old = this._events.get(event);
            if (this._events.get(event).handlers === undefined) {
                this._events.set(event, {...old, handlers: []});
                old = this._events.get(event);
            }
            old.handlers.push(fn);
            this._events.set(event, old);
            old = null;
        } else {
            throw new Error(`Subscribed instance has no event "${event}"`)
        }
    }

    trigger(event) {
        if (!this._events.has(event)) {
            throw new Error(`Subscribed instance has no event "${event}"`);
        }
        this._events.get(event).handlers.forEach((handler) => handler());
    }

    has(event) {
        return this._events.has(event);
    }
}

module.exports = Subscribed;

/**
 * @typedef event
 * @property {string} name
 */
//todo: argument names and types
