/**
 * A retry utility that executes a method with exponential backoff until success or maximum interval reached.
 *
 * Key features:
 * - Exponential backoff with configurable factor and maximum interval
 * - Prevents overlapping executions using in-flight protection
 * - AbortSignal support for graceful cancellation
 * - Automatic retry on failure with increasing delays
 * - Resource cleanup and lifecycle management
 * - Dynamic interval adjustment during runtime
 */
export class MethodRetrier {
    #fn: (signal?: AbortSignal) => Promise<void> | void;
    #interval: number;
    #backoffFactor: number;
    #maxIntervalMs: number;
    #currentInterval: number;
    #inFlight: boolean;
    #destroyed: boolean;
    #timer: ReturnType<typeof setTimeout> | null;
    #abort: AbortController | null = null;

    constructor(
        method_call: (signal?: AbortSignal) => Promise<void> | void,
        interval: number,
        backoffFactor: number = 1.3,
        maxIntervalMs: number = 30000
    ) {
        this.#fn = method_call;
        this.#interval = interval;
        this.#backoffFactor = backoffFactor;
        this.#maxIntervalMs = maxIntervalMs;
        this.#currentInterval = 0;
        this.#inFlight = false;
        this.#destroyed = false;
        this.#timer = null;
        this.#abort = null;
        this.start();
    }

    /**
     * Starts or restarts the retry loop.
     *
     * @param immediate - Whether to execute immediately or wait for the next interval (default: true)
     * @throws {Error} When the retrier has been destroyed
     */
    start(immediate: boolean = true) {
        if (this.#destroyed) {
            throw new Error("Method Retrier is destroyed");
        }
        this.stop(false); // Clear previous timers without destroying
        immediate ? this.#run() : this.#schedule();
    }

    /**
     * Stops the retry loop and optionally destroys the retrier.
     *
     * @param destroy - Whether to permanently destroy the retrier (default: true)
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
     * Executes the method with abort signal support and handles success/failure logic.
     */
    async #run() {
        let sucess = false;

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
            sucess = true;
        } catch (e) {
            if ((e as any)?.name !== "AbortError") {
                console.error("Error in Method Retrier: ", e);
            }
        } finally {
            this.#abort = null;
            this.#inFlight = false;
            sucess ? this.stop() : this.#schedule();
        }
    }

    /**
     * Schedules the next retry attempt with exponential backoff.
     */
    #schedule() {
        if (this.#destroyed) {
            return;
        }
        if (this.#currentInterval == this.#maxIntervalMs) {
            this.stop();
            return;
        }
        this.#currentInterval *= this.#backoffFactor;
        if (this.#currentInterval == 0) {
            this.#currentInterval = this.#interval;
        }
        if (this.#currentInterval > this.#maxIntervalMs) {
            this.#currentInterval = this.#maxIntervalMs;
        }
        console.log(this.#currentInterval);
        this.#timer = setTimeout(() => this.#run(), this.#currentInterval);
    }

    /**
     * Updates the retry interval and resets the backoff progression.
     *
     * @param ms - New interval in milliseconds
     * @throws {Error} When the retrier has been destroyed
     */
    setInterval(ms: number) {
        if (this.#destroyed) {
            throw new Error("Method Retrier is destroyed");
        }
        this.#interval = ms;
        this.#currentInterval = 0;
        if (this.#timer) {
            clearTimeout(this.#timer);
            this.#schedule();
        }
    }
}
