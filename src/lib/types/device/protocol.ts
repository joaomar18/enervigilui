import type { Protocol, ProtocolOptionsBase } from "./base";
import type { SvelteComponent } from "svelte";

export interface ProtocolPlugin {
    protocolText: string,
    protocolInfoText: string,
    defaultOptions: ProtocolOptionsBase,
    OptionsComponent: typeof SvelteComponent,
}


export class ProtocolRegistry {
    protocols: Map<string, ProtocolPlugin>;

    constructor() {
        this.protocols = new Map<string, ProtocolPlugin>();
    }

    registerPlugin(protocol: Protocol, plugin: ProtocolPlugin) {
        this.protocols.set(protocol, plugin);
    }

    getPlugin(protocol: Protocol): ProtocolPlugin | undefined {
        return this.protocols.get(protocol);
    }
}