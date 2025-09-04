/**
 * A polling utility that repeatedly executes a method at specified intervals.
 *
 * Features:
 * - Prevents overlapping executions with in-flight tracking
 * - Supports abort signals for cancelling long-running operations
 * - Handles errors gracefully with console logging
 * - Allows dynamic interval adjustment
 * - Proper resource cleanup and destruction
 */
export class MethodPoller {
    #fn: (signal?: AbortSignal) => Promise<void> | void;
    #interval: number;
    #inFlight: boolean;
    #destroyed: boolean;
    #timer: ReturnType<typeof setTimeout> | null;
    #abort: AbortController | null = null;

    constructor(method_call: (signal?: AbortSignal) => Promise<void> | void, interval: number) {
        this.#fn = method_call;
        this.#interval = interval;
        this.#inFlight = false;
        this.#destroyed = false;
        this.#timer = null;
        this.#abort = null;
        this.start();
    }

    /**
     * Starts or restarts the polling operation.
     * @param immediate - Whether to run the method immediately or wait for the first interval.
     */
    start(immediate: boolean = true) {
        if (this.#destroyed) {
            throw new Error("Method Poller is destroyed");
        }
        this.stop(false); // Clear previous timers without destroying
        immediate ? this.#run() : this.#schedule();
    }

    /**
     * Stops the polling operation and optionally destroys the poller.
     * @param destroy - Whether to permanently destroy the poller instance.
     */
    stop(destroy: boolean = true) {
        if (this.#timer) {
            clearTimeout(this.#timer);
        }
        this.#timer = null;
        this.#abort?.abort();
        this.#abort = null;

        if (destroy) {
            this.#destroyed = true;
            this.#fn = (() => {}) as any;
        }
    }

    /**
     * Executes the polling method with error handling and abort support.
     * Prevents overlapping executions and reschedules the next run.
     */
    async #run() {
        if (this.#destroyed) {
            return;
        }
        if (this.#inFlight) {
            this.#schedule();
            return;
        }

        this.#inFlight = true;
        this.#abort = new AbortController();

        try {
            await this.#fn(this.#abort.signal);
        } catch (e) {
            if ((e as any)?.name !== "AbortError") {
                console.error("Error in Method Poller: ", e);
            }
        } finally {
            this.#abort = null;
            this.#inFlight = false;
            this.#schedule();
        }
    }

    /**
     * Schedules the next execution of the polling method after the specified interval.
     */
    #schedule() {
        if (this.#destroyed) {
            return;
        }
        this.#timer = setTimeout(() => this.#run(), this.#interval);
    }

    /**
     * Updates the polling interval and reschedules if currently running.
     * @param ms - New interval time in milliseconds.
     */
    setInterval(ms: number) {
        if (this.#destroyed) {
            throw new Error("Method Poller is destroyed");
        }
        this.#interval = ms;
        if (this.#timer) {
            clearTimeout(this.#timer);
            this.#schedule();
        }
    }
}
