import type { ProtocolOptionsBase } from "./base";

export interface ProtocolPlugin {
    protocolText: string,
    protocolInfoText: string,
    defaultOptions: ProtocolOptionsBase,
}


export class ProtocolRegistry {

}