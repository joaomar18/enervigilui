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

    start(immediate: boolean = true) {
        if (this.#destroyed) {
            throw new Error("Method Retrier is destroyed");
        }
        this.stop(false); // Clear previous timers without destroying
        immediate ? this.#run() : this.#schedule();
    }

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
