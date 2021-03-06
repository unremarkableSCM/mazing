'use strict';

const
    eventBus = require('./event-bus');

class Input {

    constructor() {
        this._keyState = new Map();
        this._keyState.set('left', 'up');
        this._keyState.set('up', 'up');
        this._keyState.set('down', 'up');
        this._keyState.set('enter', 'up');
        this._keyState.set('other', 'up');
    }

    start() {
        window.addEventListener('keydown', (e) => {
            this._eventToState(e, 'down');
        });

        window.addEventListener('keyup', (e) => {
            this._eventToState(e, 'up');
        })
    }

    // TODO: Maybe a reset() method?

    /**
     * Return if given key is 'down'.
     */
    isDown(key) {
        return this._keyState.get(key) === 'down';
    }

    /**
     * Return if given key is 'down'. Also sets the key from 'down' to 'handling'.
     */
    isDownAndUnhandled(key) {
        if (this.isDown(key)) {
            this._keyState.set(key, 'handling');
            return true;
        }
    }

    /**
     * Return if any arrow key is 'down'.
     */
    isArrowKeyDown() {
        return (this._keyState.get('up') === 'down' ||
                this._keyState.get('down') === 'down' ||
                this._keyState.get('left') === 'down' ||
                this._keyState.get('right') === 'down');
    }

    /**
     * Returns if any key is 'down'. Also set all 'down' keys to 'handling'.
     */
    isAnyKeyDownAndUnhandled() {
        let anyKeyDown = false;

        for (let [key, value] of this._keyState) {
            if (value === 'down') {
                this._keyState.set(key, 'handling');
                anyKeyDown = true;
            }
        }

        return anyKeyDown;
    }

    _eventToState(e, state) {
        switch (e.keyCode) {

            // directionals
            case 65: // 'a'
            case 37: // left
                this._setState('left', state);
                e.preventDefault();
                break;
            case 87: // 'w'
            case 38: // up
                this._setState('up', state);
                //e.preventDefault(); // do not prevent default in case user wants to cmd+w or ctrl+w
                break;
            case 68: // 'd'
            case 39: // right
                this._setState('right', state);
                e.preventDefault();
                break;
            case 83: // 's'
            case 40: // down
                this._setState('down', state);
                e.preventDefault();
                break;

            case 32: // space   (reroutes to enter)
            case 80: // 'p'     (reroutes to enter)
            case 27: // esc     (reroutes to enter)
            case 13: // enter key
                this._setState('enter', state);
                e.preventDefault();
                break;

            // debug
            case 70: // 'f'
                this._setState('f', state);
                e.preventDefault();
                break;

            // ignore certain keys
            case 82:    // 'r'
            case 18:    // alt
            case 224:   // apple command (firefox)
            case 17:    // apple command (opera)
            case 91:    // apple command, left (safari/chrome)
            case 93:    // apple command, right (safari/chrome)
            case 84:    // 't' (i.e., open a new tab)
            case 78:    // 'n' (i.e., open a new window)
            case 219:   // left brackets
            case 221:   // right brackets
                break;

            // prevent some unwanted behaviors
            case 191:   // forward slash (page find)
            case 9:     // tab (can lose focus)
            case 16:    // shift
                e.preventDefault();
                break;

            // all other keys
            default:
                this._setState('other', state);
                break;
        }
    };

    _setState(key, state) {
        // always set 'up'
        if (state === 'up') {
            this._keyState.set(key, 'up');

        // only set 'down' if it is not already handled
        } else if (state === 'down') {
            if (this._keyState.get(key) !== 'handling') {
                this._keyState.set(key, 'down');
            }
        }
    }
}

module.exports = Input;