'use strict';

class SoundPreloader {

    constructor() {
        this._cache = new Map();
        this._totalcount = 0;
        this._loadedcount = 0;
        this._afterFinished = null;
    }

    load(paths, afterFinished) {
        this._afterFinished = afterFinished;
        this._totalcount = paths.length;

        for (let path of paths) {
            let howl = new Howl({
                urls: [path],
                onload:         () => { this._onloadEach(true, path); },
                onloaderror:    () => { this._onloadEach(false, path); }
            });
            this._cache.set(path, howl);
        }
    }

    get(path) {
        return this._cache.get(path);
    }

    _onloadEach(success, path) {
        this._loadedcount += 1;

        if (success) {
            console.log(`Loaded sound (${this._loadedcount}/${this._totalcount})`);
        } else {
            console.error(`Unable to load sound: ${path}`);
        }

        if (this._loadedcount >= this._totalcount) {
            this._afterFinished();
        }
    }
}

let soundPreloader = new SoundPreloader();
module.exports = soundPreloader;