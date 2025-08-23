import { get } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import { NodeType, NodePhase } from "$lib/types/nodes/base";
import { getNodePrefix, getInitialCommunicationID, getCommunicationID } from "../util/nodes";
import { defaultVariables } from "$lib/stores/device/variables";
import type { NodeEditState, EditableDeviceNode } from "$lib/types/nodes/base";
import type { EditableNodeModbusRTUConfig } from "$lib/types/nodes/modbusRtu";
import type { EditableNodeOPCUAConfig } from "$lib/types/nodes/opcUa";

/**
 * Handles node name changes, updating prefix and unit.
 * @param node Node to update
 * @param phase Phase for prefix
 */
export function nodeNameChange(node: EditableDeviceNode, phase: NodePhase): void {
    const newName = getNodePrefix(phase) + node.display_name;
    const currentDefaultVariables = get(defaultVariables);
    node.name = newName;
    if (!node.config.custom) {
        const defaultNodeProps = Object.values(currentDefaultVariables).find((v) => v.name === node.display_name);
        node.config.unit = defaultNodeProps?.defaultUnit || "";
    }
}

/**
 * Updates unit when node type changes.
 * @param node Node to update
 * @param nodeState Previous edit state
 */
export function nodeTypeChange(node: EditableDeviceNode, nodeState: NodeEditState): void {
    if (!node.config.custom) {
        if (node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT) {
            if (nodeState.oldVariableUnit) {
                node.config.unit = nodeState.oldVariableUnit;
            } else {
                const currentDefaultVariables = get(defaultVariables);
                const defaultNodeProps = Object.values(currentDefaultVariables).find((v) => v.name === node.display_name);
                node.config.unit = defaultNodeProps?.defaultUnit || "";
            }
        } else if (node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN) {
            nodeState.oldVariableUnit = node.config.unit;
            node.config.decimal_places = "";
            node.config.min_alarm_value = "";
            node.config.max_alarm_value = "";
            node.config.min_alarm = false;
            node.config.max_alarm = false;
            node.config.unit = "";
        }
    }
}

/**
 * Handles changes to custom status, updating name and unit.
 * @param node Node to update
 * @param nodeState Previous edit state
 * @param phase Phase for prefix
 */
export function customNodeChange(node: EditableDeviceNode, nodeState: NodeEditState, phase: NodePhase): void {
    if (node.config.custom) {
        nodeState.oldVariableName = node.display_name;
        nodeState.oldVariableUnit = node.config.unit;
        node.display_name = "";
        node.config.unit = "";
    } else {
        node.display_name = nodeState.oldVariableName;
        node.config.unit = nodeState.oldVariableUnit;
    }
    node.name = getNodePrefix(phase) + node.display_name;
}

/**
 * Handles changes to calculated status, updating communication ID and protocol.
 * @param node Node to update
 * @param nodeState Previous edit state
 * @param selectedProtocol Protocol to set
 */
export function virtualNodeChange(node: EditableDeviceNode, nodeState: NodeEditState, selectedProtocol: Protocol): void {
    if (node.config.calculated && node.communication_id !== undefined) {
        nodeState.oldCommunicationID = node.communication_id;
        node.communication_id = "";
        node.protocol = Protocol.NONE;
    } else if (!node.config.calculated && !node.communication_id) {
        node.communication_id = nodeState.oldCommunicationID ? nodeState.oldCommunicationID : "";
        node.protocol = selectedProtocol;
    }
}

/**
 * Updates protocol and communication ID of a node.
 * @param protocol New protocol
 * @param node Node to update
 */
export function changeNodeProtocol(protocol: Protocol, node: EditableDeviceNode): void {
    if (protocol === Protocol.MODBUS_RTU) {
        (node.config as EditableNodeModbusRTUConfig).register = getInitialCommunicationID(Protocol.MODBUS_RTU);
    } else if (protocol === Protocol.OPC_UA) {
        (node.config as EditableNodeOPCUAConfig).node_id = getInitialCommunicationID(Protocol.OPC_UA);
    } else {
        throw new Error("Unsupported protocol");
    }

    node.protocol = protocol;
    node.communication_id = getCommunicationID(protocol, node.config, true);
}
