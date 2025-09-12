import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes, initNodes } from "../factory/nodes";
import type { DeviceNode, EditableDeviceNode } from "$lib/types/nodes/base";
import { navigateTo } from "../view/navigation";

/**
 * Fetches and processes the configuration for all nodes of a device by its ID.
 * Calls the backend API, converts the response to DeviceNode and EditableDeviceNode arrays,
 * and navigates away if initialization fails.
 *
 * @param id The unique identifier of the device.
 * @returns A promise resolving to an object containing the initial DeviceNode array and the processed EditableDeviceNode array.
 * @throws Error if the API call fails.
 */
export async function getDeviceNodesConfig(id: number): Promise<{ initialNodes: Array<DeviceNode>, nodes: Array<EditableDeviceNode> }> {
    let initialNodes: Array<DeviceNode> = [];
    let nodes: Array<EditableDeviceNode> = [];
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_config",
        method: "GET",
        params: { id },
    });

    if (sucess) {
        let requestDeviceNodes: Record<string, DeviceNode> = data;
        initialNodes = processInitialNodes(Object.values(requestDeviceNodes) as Array<DeviceNode>);
        const { sucess, editableNodes } = initNodes(initialNodes);
        if (sucess) {
            nodes = editableNodes;
        } else {
            await navigateTo("/devices");
        }
    } else {
        throw new Error("Get device nodes config error");
    }

    return { initialNodes, nodes };
}
