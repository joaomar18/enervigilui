import type { Device, EditableDevice, NewDevice } from "$lib/types/device/base";
import type { NodeRecord, EditableNodeRecord } from "$lib/types/nodes/base";
import type { DeviceOPCUAConfig } from "$lib/types/device/opcUa";
import type { DeviceModbusRTUConfig } from "$lib/types/device/modbusRtu";
import { areDevicesEqual } from "../validation/device/base";
import { areNodesEqual } from "../validation/nodes/base";
import { convertToDevice } from "../factory/device";
import { convertToNodes } from "../factory/nodes";


export function filterDevices(devices: Array<Device>, searchQuery: string): Array<Device> {
    let filteredDevices: Array<Device> = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

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


export function normalizeDevice(device: Device): Device {
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


export function noChangesToDevice(
    initialDeviceData: Device,
    deviceData: EditableDevice | NewDevice,
    initialNodes: Array<NodeRecord>,
    nodes: Array<EditableNodeRecord>
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