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
        this.interval = 0;

        this._activeFps = 60;
        this._idleFps = 0;
        this._wantedDeltaTime = -1;
        this._currentRequestId = null;

        // if (config.get("activeFps")) {}
        this._idle = false; // true = isIdle, false = isActive
        this.idleTime = 10000; // time after app goes to idle in milliseconds, -1 is never
        this.lastLoopTime = 0;

        this.refreshIntervalValue();


        this.fps = this.activeFps;
        this.initListeners();

        self.app.events.emit("initialize");
    }

    /**
     * Refresh the wanted time interval between callbacks
     */
    refreshIntervalValue() {
        if (this._idle) {
            if (this._idleFps > 0) {
                this.interval = 1000 / this._idleFps;
            } else {
                this.interval = -1;
            }
        } else {
            this.interval = 1000 / this._activeFps;
        }
    }


    initListeners() {
        window.addEventListener("focus", () => {
            if (this._currentRequestId) {
                window.cancelAnimationFrame(this._currentRequestId);
            }
            this._loop();
            this.setIdle(false);
        }, true);
        window.addEventListener("blur", () => {
            this.setIdle(true);
        }, true);
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
        if (this._currentRequestId) {
            window.cancelAnimationFrame(this._currentRequestId);
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
        if (this._currentRequestId) {
            window.cancelAnimationFrame(this._currentRequestId);
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
    _loop(now) {
        if (this.interval < 0) {
            return;
        }
        this._currentRequestId = requestAnimationFrame(t => this._loop(t));

        const timeSinceLastCall = now - this.lastLoopTime;

        if (timeSinceLastCall > this.interval) {

            this.fps = 1000 / timeSinceLastCall;
            this.lastLoopTime = now - (timeSinceLastCall % this.interval);
            console.log("fps", this.fps);


            self.app.events.emit("update", {
                deltaTime: timeSinceLastCall,
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

        }

        /*

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
        */

    }

    // -- GETTERS SETTERS ---
    setActiveFps(activeFps) {
        this._activeFps = activeFps;
        this.refreshIntervalValue();
    }

    getActiveFps() {
        return this._activeFps;
    }

    setIdleFps(idleFps) {
        this._idleFps = idleFps;
        this.refreshIntervalValue();
    }

    getIdleFps() {
        return this._idleFps;
    }

    getIdle() {
        return this._idle;
    }

    setIdle(isIdle) {
        this._idle = isIdle;
        this.refreshIntervalValue();
    }
    //---------------------


}
