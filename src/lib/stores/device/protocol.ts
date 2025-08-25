import { writable } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import type { EditableBaseCommunicationConfig } from "$lib/types/device/base";
import type { SvelteComponent } from "svelte";
import { defaultModbusRTUOptions } from "$lib/types/device/modbusRtu";
import { defaultOPCUAOptions } from "$lib/types/device/opcUa";
import ModbusRtuConfig from "../../../components/Devices/ModbusRTUConfig.svelte";
import OpcuaConfig from "../../../components/Devices/OPCUAConfig.svelte";

export interface ProtocolPlugin {
    textKey: string;
    infoTextKey: string;
    defaultOptions: EditableBaseCommunicationConfig;
    ConfigComponent: typeof SvelteComponent<any> | null;
}

/*     N O     P R O T O C O L     P L U G I N     */

const noProtocolPlugin: ProtocolPlugin = {
    textKey: "noProtocol",
    infoTextKey: "noProtocolInfo",
    defaultOptions: { valid: false },
    ConfigComponent: null,
};

/*     M O D B U S     R T U     P L U G I N     */

const modbusRtuPlugin: ProtocolPlugin = {
    textKey: "modbusRegister",
    infoTextKey: "registerInfo",
    defaultOptions: defaultModbusRTUOptions,
    ConfigComponent: ModbusRtuConfig,
};

/*     O P C     U A     P L U G I N     */

const opcUaPlugin: ProtocolPlugin = {
    textKey: "opcuaID",
    infoTextKey: "nodespaceInfo",
    defaultOptions: defaultOPCUAOptions,
    ConfigComponent: OpcuaConfig,
};

export const protocolPlugins = writable<Record<Protocol, ProtocolPlugin>>({
    [Protocol.NONE]: noProtocolPlugin,
    [Protocol.MODBUS_RTU]: modbusRtuPlugin,
    [Protocol.OPC_UA]: opcUaPlugin,
});
