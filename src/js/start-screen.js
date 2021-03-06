'use strict';

const
    eventBus = require('./event-bus');

const
    totalTime = 2500;

class StartScreen {

    constructor(stage, input) {
        this._stage = stage;
        this._input = input;

        this._pixelateTransitionTimeLeft = 0;

        this._logo = new PIXI.Container();
        stage.addChild(this._logo);

        let style = {
            font: '36px Arial',
            fill: '#eeeeee',
            align: 'center'
        };
        let text = new PIXI.Text('Based on a true story', style);
        text.anchor.set(0.5, 0.5);
        text.x = 400;
        text.y = 300;
        this._logo.addChild(text);
    }

    start() {
        this._pixelateTransitionTimeLeft = totalTime;
    }

    step(elapsed) {

        // Kinda bad to do it this way, but will proably be replaced at some point.
        let pctDone = this._pixelateTransitionTimeLeft / totalTime;
        if (this._input.isAnyKeyDownAndUnhandled() && pctDone > 0.2) {
            this._pixelateTransitionTimeLeft = totalTime * 0.2;
        }

        this._pixelateTransitionTimeLeft -= elapsed;
        if (this._pixelateTransitionTimeLeft <= 0) {
            let idx = this._stage.getChildIndex(this._logo);
            this._stage.removeChildAt(idx);
            eventBus.fire({ name: 'event.startscreen.end' });

        } else {
            this._logo.alpha = calculateAlpha(this._pixelateTransitionTimeLeft, totalTime);
        }
    }
}

module.exports = StartScreen;

function calculateAlpha(timeLeft, totalTime) {
    let pct = 1 - (timeLeft / totalTime);

    if (pct < 0.8) {
        return pct;
    } else {
        return 0.8 - ((pct - 0.8) / 0.2);
    }
}