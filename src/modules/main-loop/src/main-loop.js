import self from "../index";

/**
 * A generic 60 Hz loop.
 *
 * @class obsidian-core.lib.mainloop
 * @constructor
 */
export default class MainLoop {

    constructor() {
        this.callbacks = [];
        this.enabled = false;
        // if (config.get("activeFps")) {}
        this.isIdle = false; // true = isIdle, false = isActive
        this.activeFps = 60; // max desired fps, -1 mean get max possible fps
        this.idleFps = 0; // framerate when application is not active and not visible
        this.idleTime = 10000; // time after app goes to idle in milliseconds, -1 is never
        this.lastLoopTime = 0;

        this._currentTimeout = null;

        this.fps = this.activeFps;
        this.initListeners();

        self.app.events.emit("initialize");
    }

    initListeners() {
        window.addEventListener("focus", () => {
            if (this._currentTimeout) {
                window.clearTimeout(this._currentTimeout);
            }
            this._loop();
            this.isIdle = false;
        }, true);
        window.addEventListener("blur", () => {
            this.isIdle = true;
        }, true);
    }


    getFps() {
        return this.fps;
    }

    /**
     * The callbacks
     *
     * @property callbacks
     * @type Function[]
     * @default []
     */
    getCallbacks() {
        return this.callbacks;
    }

    setCallbacks(callbacks = []) {
        this.callbacks = callbacks;
    }

    /**
     * Start the loop.
     *
     * @method start
     */
    start() {
        this.enabled = true;
        if (this._currentTimeout) {
            window.clearTimeout(this._currentTimeout);
        }
        this._loop();
        self.app.events.emit("start");
    }

    /**
     * Stop the loop.
     *
     * @method stop
     */
    stop() {
        this.enabled = false;
        if (this._currentTimeout) {
            window.clearTimeout(this._currentTimeout);
        }
        self.app.events.emit("stop");
    }

    /**
     * Add a callback.
     *
     * @method addCallback
     * @param {Function} callback
     */
    addCallback(callback) {
        this.callbacks.push(callback);
    }

    /**
     * Remove a callback.
     *
     * @method removeCallback
     * @param {Function} callback
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }

    /**
     * The loop.
     *
     * @method _loop
     * @private
     * @param {Number} timestamp
     */
    _loop() {
        if (!this.enabled) {
            return;
        }
        let wantedFps;
        if (this.isIdle === true) {
            wantedFps = this.idleFps;
            if (this.idleFps <= 0) {
                return;
            }
        } else {
            wantedFps = this.activeFps < 0 ? Number.MAX_VALUE : this.activeFps;
        }
        const wantedTimeToNextCall = 1000 / wantedFps;
        const timeSinceLastCall = Date.now() - this.lastLoopTime;
        // let's compute time we want to wait to suit activeFps (use on settimeout)
        let delay = wantedTimeToNextCall - timeSinceLastCall;
        delay = Math.max(0, delay);

        this._currentTimeout = setTimeout(() => {
            const newTime = Date.now();
            const deltaTime = (newTime - this.lastLoopTime);
            this.fps = 1000 / deltaTime;
            console.log("fps", this.fps);
            this.lastLoopTime = newTime;

            self.app.events.emit("update", {
                deltaTime: deltaTime,
                fps: this.fps,
                isIdle: this.isIdle,
            });

            for (let i = 0; i < this.callbacks.length; i++) {
                try {
                    this.callbacks[i](timeSinceLastCall, this.isIdle);
                } catch (error) {
                    console.error(error);
                }
            }

            this._loop();
            //  requestAnimationFrame(() => this._loop());

        }, delay);

    }

}
