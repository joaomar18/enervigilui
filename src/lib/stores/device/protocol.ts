import { writable } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import type { BaseCommunicationConfig, EditableBaseCommunicationConfig, MeterOptions } from "$lib/types/device/base";
import type { DeviceOPCUAConfig, EditableDeviceOPCUAConfig } from "$lib/types/device/opcUa";
import type { DeviceModbusRTUConfig, EditableDeviceModbusRTUConfig } from "$lib/types/device/modbusRtu";
import type { NodeModbusRTUConfig, EditableNodeModbusRTUConfig, NodeModbusRTUAdditionalInfo } from "$lib/types/nodes/protocol/modbusRtu";
import type { NodeOPCUAConfig, EditableNodeOPCUAConfig, NodeOPCUAAdditionalInfo } from "$lib/types/nodes/protocol/opcUa";
import type { SvelteComponent } from "svelte";
import { defaultModbusRTUOptions } from "$lib/types/device/modbusRtu";
import { defaultOPCUAOptions } from "$lib/types/device/opcUa";
import { defaultBaseNodeConfig } from "$lib/types/nodes/config";
import ModbusRtuConfig from "../../../components/Devices/ModbusRTUConfig.svelte";
import OpcuaConfig from "../../../components/Devices/OPCUAConfig.svelte";
import type { DefaultNodeInfo } from "$lib/types/nodes/base";
import type { BaseNodeConfig, EditableBaseNodeConfig, EditableNodeRecord } from "$lib/types/nodes/config";
import type { BaseNodeAdditionalInfo } from "$lib/types/nodes/realtime";
import {
    convertToBaseNodeConfig,
    convertToEditableBaseNodeConfig,
    processInitialBaseNodeConfig,
    getEditableBaseNodeConfigFromDefaultVar,
} from "$lib/logic/factory/nodes";
import { validateModbusRegister } from "$lib/logic/validation/nodes/modbusRtu";
import { validateOpcUaNodeId } from "$lib/logic/validation/nodes/opcUa";

export interface ProtocolPlugin {
    textKey: string;
    shortTextKey: string;
    infoTextKey: string;
    defaultCommID?: string;
    defaultOptions: EditableBaseCommunicationConfig;
    ConfigComponent: typeof SvelteComponent<any> | null;
    convertCommOptionsToEditable: (communicationOptions: BaseCommunicationConfig) => EditableBaseCommunicationConfig;
    convertCommOptionsToNormal: (editableCommunicationOptions: EditableBaseCommunicationConfig) => BaseCommunicationConfig;
    convertNodeConfigToEditable: (configuration: BaseNodeConfig) => EditableBaseNodeConfig;
    convertNodeConfigToNormal: (editableConfiguration: EditableBaseNodeConfig) => BaseNodeConfig;
    processInitialNodeConfig: (configuration: BaseNodeConfig) => BaseNodeConfig;
    createNodeConfigFromDefaultVar: (variable: DefaultNodeInfo, options: MeterOptions) => EditableBaseNodeConfig;
    createNewEditableNodeConfig: () => EditableBaseNodeConfig;
    getCommID: (node_object: BaseNodeConfig | EditableBaseNodeConfig | BaseNodeAdditionalInfo, noFormat: boolean) => string;
    validateCommID: (communicationID: string) => boolean;
    setCommID: (node: EditableNodeRecord) => void;
    setCommIDToDefault: (node: EditableNodeRecord) => void;
}

/*     N O     P R O T O C O L     P L U G I N     */

const noProtocolPlugin: ProtocolPlugin = {
    textKey: "noProtocol",
    shortTextKey: "address",
    infoTextKey: "noProtocolInfo",
    defaultOptions: { valid: false },
    ConfigComponent: null,
    convertCommOptionsToEditable: (communicationOptions) => {
        throw new Error("Unsupported Protocol");
    },
    convertCommOptionsToNormal: (editableCommunicationOptions) => {
        throw new Error("Unsupported Protocol");
    },
    convertNodeConfigToEditable: (configuration) => {
        return convertToEditableBaseNodeConfig(configuration);
    },
    convertNodeConfigToNormal: (editableConfiguration) => {
        return convertToBaseNodeConfig(editableConfiguration);
    },
    processInitialNodeConfig: (configuration) => {
        return processInitialBaseNodeConfig(configuration);
    },
    createNodeConfigFromDefaultVar(variable, options) {
        return getEditableBaseNodeConfigFromDefaultVar(variable, options);
    },
    createNewEditableNodeConfig() {
        return { ...defaultBaseNodeConfig };
    },
    getCommID(node_object, noFormat) {
        return "";
    },
    validateCommID(communicationID) {
        return communicationID.length === 0;
    },
    setCommID(node) {
        throw new Error("Unsupported Protocol");
    },
    setCommIDToDefault(node) {
        throw new Error("Unsupported Protocol");
    },
};

/*     M O D B U S     R T U     P L U G I N     */

const modbusRtuPlugin: ProtocolPlugin = {
    textKey: "modbusRegister",
    shortTextKey: "address",
    infoTextKey: "registerInfo",
    defaultCommID: "0x",
    defaultOptions: defaultModbusRTUOptions,
    ConfigComponent: ModbusRtuConfig,
    convertCommOptionsToEditable: (communicationOptions) => {
        let modbusCommOptions = communicationOptions as DeviceModbusRTUConfig;
        return {
            baudrate: modbusCommOptions.baudrate.toString(),
            bytesize: modbusCommOptions.bytesize.toString(),
            parity: modbusCommOptions.parity,
            port: modbusCommOptions.port,
            read_period: modbusCommOptions.read_period.toString(),
            retries: modbusCommOptions.retries.toString(),
            slave_id: modbusCommOptions.slave_id.toString(),
            stopbits: modbusCommOptions.stopbits.toString(),
            timeout: modbusCommOptions.timeout.toString(),
            valid: false,
        } as EditableDeviceModbusRTUConfig;
    },
    convertCommOptionsToNormal: (editableCommunicationOptions) => {
        let modbusRtuEditableCommOptions = editableCommunicationOptions as EditableDeviceModbusRTUConfig;
        return {
            baudrate: parseInt(modbusRtuEditableCommOptions.baudrate),
            bytesize: parseInt(modbusRtuEditableCommOptions.bytesize),
            parity: modbusRtuEditableCommOptions.parity,
            port: modbusRtuEditableCommOptions.port,
            read_period: parseInt(modbusRtuEditableCommOptions.read_period),
            retries: parseInt(modbusRtuEditableCommOptions.retries),
            slave_id: parseInt(modbusRtuEditableCommOptions.slave_id),
            stopbits: parseInt(modbusRtuEditableCommOptions.stopbits),
            timeout: parseInt(modbusRtuEditableCommOptions.timeout),
        } as DeviceModbusRTUConfig;
    },
    convertNodeConfigToEditable: (configuration) => {
        let editableBaseConfig = convertToEditableBaseNodeConfig(configuration);
        return {
            ...editableBaseConfig,
            register: (configuration as NodeModbusRTUConfig).register.toString(),
        } as EditableNodeModbusRTUConfig;
    },
    convertNodeConfigToNormal: (editableConfiguration) => {
        let baseConfig = convertToBaseNodeConfig(editableConfiguration);
        return {
            ...baseConfig,
            register: parseInt((editableConfiguration as EditableNodeModbusRTUConfig).register),
        } as NodeModbusRTUConfig;
    },
    processInitialNodeConfig: (configuration) => {
        let baseConfig = processInitialBaseNodeConfig(configuration);
        return {
            ...baseConfig,
            register: (configuration as NodeModbusRTUConfig).register,
        } as NodeModbusRTUConfig;
    },
    createNodeConfigFromDefaultVar(variable, options) {
        let editableBaseConfig = getEditableBaseNodeConfigFromDefaultVar(variable, options);
        return {
            ...editableBaseConfig,
            register: this.defaultCommID,
        } as EditableNodeModbusRTUConfig;
    },
    createNewEditableNodeConfig() {
        let newEditableBaseConfig = { ...defaultBaseNodeConfig };
        return {
            ...newEditableBaseConfig,
            register: this.defaultCommID,
        } as EditableNodeModbusRTUConfig;
    },
    getCommID(node_object, noFormat) {
        let register = (node_object as EditableNodeModbusRTUConfig | NodeModbusRTUConfig | NodeModbusRTUAdditionalInfo).register;
        return noFormat ? String(register) : this.defaultCommID + Number(register).toString(16).toUpperCase().padStart(4, "0");
    },
    validateCommID(communicationID) {
        return validateModbusRegister(communicationID);
    },
    setCommID(node) {
        (node.config as EditableNodeModbusRTUConfig).register = String(parseInt(node.communication_id.replace("0x", ""), 16));
    },
    setCommIDToDefault(node) {
        (node.config as EditableNodeModbusRTUConfig).register = this.defaultCommID ?? "";
    },
};

/*     O P C     U A     P L U G I N     */

const opcUaPlugin: ProtocolPlugin = {
    textKey: "opcuaID",
    shortTextKey: "opcuaID",
    infoTextKey: "nodespaceInfo",
    defaultCommID: "ns=;i=",
    defaultOptions: defaultOPCUAOptions,
    ConfigComponent: OpcuaConfig,
    convertCommOptionsToEditable(communicationOptions) {
        let opcUaCommOptions = communicationOptions as DeviceOPCUAConfig;
        return {
            username: opcUaCommOptions.username || "",
            password: opcUaCommOptions.password || "",
            read_period: opcUaCommOptions.read_period.toString(),
            timeout: opcUaCommOptions.timeout.toString(),
            url: opcUaCommOptions.url,
            valid: false,
        } as EditableDeviceOPCUAConfig;
    },
    convertCommOptionsToNormal: (editableCommunicationOptions) => {
        let opcUaEditableCommOptions = editableCommunicationOptions as EditableDeviceOPCUAConfig;
        return {
            username: opcUaEditableCommOptions.username || null,
            password: opcUaEditableCommOptions.password || null,
            read_period: parseInt(opcUaEditableCommOptions.read_period),
            timeout: parseInt(opcUaEditableCommOptions.timeout),
            url: opcUaEditableCommOptions.url,
        } as DeviceOPCUAConfig;
    },
    convertNodeConfigToEditable: (configuration) => {
        let editableBaseConfig = convertToEditableBaseNodeConfig(configuration);
        return {
            ...editableBaseConfig,
            node_id: (configuration as NodeOPCUAConfig).node_id,
        } as EditableNodeOPCUAConfig;
    },
    convertNodeConfigToNormal: (editableConfiguration) => {
        let baseConfig = convertToBaseNodeConfig(editableConfiguration);
        return {
            ...baseConfig,
            node_id: (editableConfiguration as EditableNodeOPCUAConfig).node_id,
        } as NodeOPCUAConfig;
    },
    processInitialNodeConfig: (configuration) => {
        let baseConfig = processInitialBaseNodeConfig(configuration);
        return {
            ...baseConfig,
            node_id: (configuration as NodeOPCUAConfig).node_id,
        } as NodeOPCUAConfig;
    },
    createNodeConfigFromDefaultVar(variable, options) {
        let editableBaseConfig = getEditableBaseNodeConfigFromDefaultVar(variable, options);
        return {
            ...editableBaseConfig,
            node_id: this.defaultCommID,
        } as EditableNodeOPCUAConfig;
    },
    createNewEditableNodeConfig() {
        let newEditableBaseConfig = { ...defaultBaseNodeConfig };
        return {
            ...newEditableBaseConfig,
            node_id: this.defaultCommID,
        } as EditableNodeOPCUAConfig;
    },
    getCommID(node_object, noFormat) {
        return (node_object as EditableNodeOPCUAConfig | NodeOPCUAConfig | NodeOPCUAAdditionalInfo).node_id;
    },
    validateCommID(communicationID) {
        return validateOpcUaNodeId(communicationID);
    },
    setCommID(node) {
        (node.config as EditableNodeOPCUAConfig).node_id = node.communication_id;
    },
    setCommIDToDefault(node) {
        (node.config as EditableNodeOPCUAConfig).node_id = this.defaultCommID ?? "";
    },
};

export const protocolPlugins = writable<Record<Protocol, ProtocolPlugin>>({
    [Protocol.NONE]: noProtocolPlugin,
    [Protocol.MODBUS_RTU]: modbusRtuPlugin,
    [Protocol.OPC_UA]: opcUaPlugin,
});
