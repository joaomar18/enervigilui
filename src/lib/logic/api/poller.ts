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

    start(immediate: boolean = true) {
        if (this.#destroyed) {
            throw new Error("Method Poller is destroyed");
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

    #schedule() {
        if (this.#destroyed) {
            return;
        }
        this.#timer = setTimeout(() => this.#run(), this.#interval);
    }

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
