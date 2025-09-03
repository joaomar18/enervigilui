import { get } from "svelte/store";
import { MeterType, Protocol } from "$lib/types/device/base";
import { NodeType, NodePhase } from "$lib/types/nodes/base";
import { getNodePrefix, getNodeIndex, getCommunicationID } from "../util/nodes";
import { defaultVariables } from "$lib/stores/device/variables";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { nodeSections } from "$lib/types/nodes/base";
import type { NodeEditState, EditableDeviceNode } from "$lib/types/nodes/base";

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
 * Updates the communication ID of a node using the protocol plugin's logic.
 * @param node - The editable device node to update.
 */
export function communicationIDChange(node: EditableDeviceNode): void {
    if (node.protocol === Protocol.NONE) {
        return;
    }
    let plugin = get(protocolPlugins)[node.protocol];
    plugin.setCommID(node);
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
    let plugin = get(protocolPlugins)[protocol];
    plugin.setCommIDToDefault(node);
    node.protocol = protocol;
    node.communication_id = getCommunicationID(protocol, node.config, true);
}

/**
 * Updates a node in the nodes array and returns a new array with the changes.
 * @param node Node with updated data
 * @param nodes Array of nodes to update
 * @returns New array with the updated node
 */
export function updateNodes(node: EditableDeviceNode, nodes: Array<EditableDeviceNode>): Array<EditableDeviceNode> {
    const editNodesIndex = getNodeIndex(node, nodes);
    let newNodes = [...nodes];
    if (editNodesIndex !== -1) {
        newNodes[editNodesIndex] = node;
    }
    return newNodes;
}

/**
 * Groups nodes by their respective sections based on meter type.
 * @param meterType Type of meter to filter nodes for
 * @param nodes Array of nodes to group
 * @returns Record with nodes grouped by phase sections
 */
export function updateNodesBySection(meterType: MeterType, nodes: Array<EditableDeviceNode>): Record<NodePhase, Array<EditableDeviceNode>> {
    return nodeSections.reduce((acc: Record<NodePhase, Array<EditableDeviceNode>>, section) => {
        acc[section.key] = nodes.filter((node) => section.filter(node, meterType));
        return acc;
    }, {} as Record<NodePhase, Array<EditableDeviceNode>>);
}

/**
 * Updates the editing node reference if it matches the updated node.
 * @param node Node that was updated
 * @param editingNode Currently editing node
 * @param nodes Array of all nodes
 * @returns Updated editing node reference
 */
export function updateEditingNode(node: EditableDeviceNode, editingNode: EditableDeviceNode, nodes: Array<EditableDeviceNode>): EditableDeviceNode {
    const editNodesIndex = getNodeIndex(node, nodes);
    let newEditingNode = editingNode;
    if (nodes[editNodesIndex] === editingNode) {
        newEditingNode = nodes[editNodesIndex];
    }
    return newEditingNode;
}

/**
 * Removes a node from the nodes array and returns a new array.
 * @param node Node to delete
 * @param nodes Array of nodes to delete from
 * @returns New array with the node removed
 */
export function deleteNodeFromArray(node: EditableDeviceNode, nodes: Array<EditableDeviceNode>): Array<EditableDeviceNode> {
    let deletedNodeIndex = getNodeIndex(node, nodes);
    let newNodes: Array<EditableDeviceNode> = [...nodes];
    if (deletedNodeIndex !== -1) {
        newNodes = [...newNodes.slice(0, deletedNodeIndex), ...newNodes.slice(deletedNodeIndex + 1)];
    }
    return newNodes;
}
