'use strict';

const
    LoadingScreen = require('./loading-screen');

const
    soundPreloader = require('./sound-preloader');

class Preload {

    constructor() {
        this._sfxLoaded = false;
        this._gfxLoaded = false;
        this._afterFinished = null;
        this._success = true;

        this._loadingScreen = new LoadingScreen();
    }

    start(afterFinished) {
        this._afterFinished = afterFinished;

        PIXI.loader.on('error', () => {
            this._loadingScreen.signalLoaded(false, 'Could not load sprites');
            this._success = false;
        });
        PIXI.loader.add('assets/mazing-v1.json').load(() => {
            this._gfxLoaded = true;
            this._loadingScreen.signalLoaded('Sprites loaded');
            this._handleIfFinished();
        });

        // NOTE: The rest of the sounds are loaded later on. These are needed in the beginning.
        soundPreloader.load(this._loadingScreen, [
            'assets/punch-v1.m4a',
            'assets/wham1-v1.m4a',
            'assets/wham2-v1.m4a',
            'assets/wham3-v1.m4a',
            'assets/energizer-v1.m4a',
            'assets/crackles-v1.m4a',
            'assets/cool-journey-v1.m4a'
        ], (success) => {
            this._sfxLoaded = true;
            this._handleIfFinished(success);
        });
    }

    _handleIfFinished(success) {
        if (success === false) {
            this._success = false;
        }

        if (this._success && this._gfxLoaded && this._sfxLoaded === true) {
            this._afterFinished();
        }
    }
}

let preload = new Preload();
module.exports = preload;