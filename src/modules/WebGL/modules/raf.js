import dispatcher from './dispatcher';

class Raf {
    constructor() {
        this.time = window.performance.now();
        this.elapsed = 0;
        this.isPaused = false;

        this.start();
    }

    start() {
        this.startTime = window.performance.now();
        this.oldTime = this.startTime;
        this.isPaused = false;

        this.onTick(this.startTime);
    }

    pause() {
        this.isPaused = true;
    }

    onTick = (now) => {
        this.time = now;

        if (!this.isPaused) {
            this.delta = (now - this.oldTime) / 1000;
            this.oldTime = now;
            this.elapsed += this.delta;

            dispatcher.trigger(
                { name: 'raf' },
                {
                    delta: this.delta,
                    now,
                    elapsed: this.elapsed,
                }
            );
        }

        window.requestAnimationFrame(this.onTick);
    };
}

export const raf = new Raf();
