import type { DeviceMeter, EditableDeviceMeter, NewDeviceMeter } from "$lib/types/device/base";
import type { DeviceNode, EditableDeviceNode } from "$lib/types/nodes/base";
import type { DeviceOPCUAConfig } from "$lib/types/device/opcUa";
import type { DeviceModbusRTUConfig } from "$lib/types/device/modbusRtu";
import { areDevicesEqual } from "../validation/device/base";
import { areNodesEqual } from "../validation/nodes/base";
import { convertToDevice } from "../factory/device";
import { convertToNodes } from "../factory/nodes";
//import { currentDeviceID } from "$lib/stores/device/current";

/**
 * Filters devices by name or ID.
 * @param devices Array of DeviceMeter.
 * @param searchQuery Search string.
 * @returns Filtered array sorted by ID.
 */
export function filterDevices(devices: Array<DeviceMeter>, searchQuery: string): Array<DeviceMeter> {
    let filteredDevices: Array<DeviceMeter> = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

    if (!searchQuery || searchQuery.trim() === "") {
        return filteredDevices;
    }

    const query = searchQuery.trim().toLowerCase();

    // Filter devices that match the search query in name or ID
    filteredDevices = filteredDevices.filter((device) => {
        const nameMatch = device.name.toLowerCase().includes(query);

        // ID matching: handle both partial string matching and numeric matching with leading zeros
        const idString = device.id.toString();
        const partialIdMatch = idString.includes(query);

        // For numeric queries, parse and compare the numeric values to handle leading zeros
        const numericMatch = !isNaN(parseInt(query)) && parseInt(query) === device.id;

        return nameMatch || partialIdMatch || numericMatch;
    });

    return filteredDevices;
}

/**
 * Normalizes a DeviceMeter for comparison.
 * @param device DeviceMeter to normalize.
 * @returns Normalized device.
 */
export function normalizeDevice(device: DeviceMeter): DeviceMeter {
    return {
        connected: device.connected,
        id: device.id,
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: device.options,
        communication_options: Object.fromEntries(Object.entries(device.communication_options).sort(([a], [b]) => a.localeCompare(b))) as
            | DeviceOPCUAConfig
            | DeviceModbusRTUConfig,
    };
}

/**
 * Checks if there are no changes between initial and current device/nodes data.
 * @param initialDeviceData Original device data
 * @param deviceData Current editable device data
 * @param initialNodes Original nodes array
 * @param nodes Current editable nodes array
 * @returns True if no changes detected, false otherwise
 */
export function noChangesToDevice(
    initialDeviceData: DeviceMeter,
    deviceData: EditableDeviceMeter | NewDeviceMeter,
    initialNodes: Array<DeviceNode>,
    nodes: Array<EditableDeviceNode>
): boolean {
    if (
        areNodesEqual(initialNodes, convertToNodes(nodes)) &&
        areDevicesEqual(initialDeviceData, convertToDevice(deviceData)) &&
        deviceData.device_image === undefined
    ) {
        return true;
    }
    return false;
}