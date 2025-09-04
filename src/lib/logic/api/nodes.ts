import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes } from "../factory/nodes";
import type { DeviceNode } from "$lib/types/nodes/base";

/**
 * Retrieves device node configuration from the server.
 * Fetches all nodes/variables associated with a specific device and processes them for use.
 *
 * @param id - The unique identifier of the device whose nodes to retrieve.
 * @returns Object containing processed array of device nodes/variables.
 * @throws Error if the API request fails.
 */
export async function getDeviceNodesConfig(id: number): Promise<{ initialNodes: Array<DeviceNode> }> {
    let initialNodes: Array<DeviceNode>;
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_config",
        method: "GET",
        params: { id },
    });

    if (sucess) {
        let requestDeviceNodes: Record<string, DeviceNode> = data;
        initialNodes = processInitialNodes(Object.values(requestDeviceNodes) as Array<DeviceNode>);
    } else {
        throw new Error("Get device nodes config error");
    }

    return { initialNodes };
}
