import type { DeviceMeter, DeviceModbusRTUConfig, DeviceOPCUAConfig } from "$lib/stores/devices";

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
