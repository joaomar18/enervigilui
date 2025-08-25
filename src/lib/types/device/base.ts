import type { DeviceOPCUAConfig, EditableDeviceOPCUAConfig } from "./opcUa";
import type { DeviceModbusRTUConfig, EditableDeviceModbusRTUConfig } from "./modbusRtu";

/*****     C O N S T A N T S     *****/

// Communication Limits
export const READ_PERIOD_LIM: Record<string, number> = { MIN: 5, MAX: 300 };
export const TIMEOUT_LIM: Record<string, number> = { MIN: 1, MAX: 15 };

/*****     E N U M S     *****/

/**
 * Communication protocols supported by the energy monitoring system.
 * Defines the available protocols for communicating with external devices and systems.
 */
export enum Protocol {
    MODBUS_RTU = "MODBUS_RTU",
    OPC_UA = "OPC_UA",
    NONE = "NONE",
}

/**
 * Meter types supported by the energy monitoring system.
 * Defines the electrical connection types for energy metering and analysis.
 */
export enum MeterType {
    SINGLE_PHASE = "SINGLE_PHASE",
    THREE_PHASE = "THREE_PHASE",
}

/*****     I N T E R F A C E S     *****/

/**
 * Abstract base type for protocol-specific options.
 * Extend this interface for each protocol to define its configuration shape.
 */
export interface ProtocolOptionsBase {
    // Base Options Interface for Protocols
}


/**
 * Configuration interface for energy meter-specific operational options.
 * Defines boolean flags that control various measurement capabilities and
 * data acquisition behaviors of the energy monitoring device.
 *
 * @interface MeterOptions
 * @property {boolean} frequency_reading - Enable frequency measurement capability (typically 50/60 Hz grid frequency)
 * @property {boolean} negative_reactive_power - Allow negative reactive power values for leading power factor conditions
 * @property {boolean} read_energy_from_meter - Enable energy consumption readings directly from the meter device
 * @property {boolean} read_separate_forward_reverse_energy - Read forward and reverse energy values as separate measurements
 */
export interface MeterOptions {
    frequency_reading: boolean;
    negative_reactive_power: boolean;
    read_energy_from_meter: boolean;
    read_separate_forward_reverse_energy: boolean;
}

/**
 * Complete device meter configuration interface.
 * Represents a comprehensive energy monitoring device with all its configuration
 * parameters, operational settings, and communication details. This is the main
 * interface that combines all other configuration interfaces into a single device entity.
 *
 * @interface DeviceMeter
 * @property {boolean} connected - Current connection status of the device (true if actively connected)
 * @property {number} id - Unique numeric identifier for the device within the system
 * @property {string} name - Human-readable name/label for the device (e.g., "Main Building Meter")
 * @property {Protocol} protocol - Communication protocol used by this device (MODBUS_RTU, OPC_UA, or NONE)
 * @property {MeterType} type - Electrical connection type (SINGLE_PHASE or THREE_PHASE)
 * @property {MeterOptions} options - Operational settings controlling measurement capabilities and data acquisition
 * @property {CommunicationOptions} communication_options - Protocol-specific communication parameters and settings
 */
export interface DeviceMeter {
    connected: boolean;
    id: number;
    name: string;
    protocol: Protocol;
    type: MeterType;
    options: MeterOptions;
    communication_options: CommunicationOptions;
}

/**
 * Editable device meter configuration interface.
 * This interface mirrors DeviceMeter but uses EditableCommunicationOptions to support
 * form input handling where communication parameters are entered as strings. Used primarily
 * in device configuration forms and editing components where user input validation is required.
 *
 * @interface EditableDeviceMeter
 * @property {boolean} connected - Current connection status of the device (true if actively connected)
 * @property {number} id - Unique numeric identifier for the device within the system
 * @property {string} name - Human-readable name/label for the device (e.g., "Main Building Meter")
 * @property {Protocol} protocol - Communication protocol used by this device (MODBUS_RTU, OPC_UA, or NONE)
 * @property {MeterType} type - Electrical connection type (SINGLE_PHASE or THREE_PHASE)
 * @property {MeterOptions} options - Operational settings controlling measurement capabilities and data acquisition
 * @property {EditableCommunicationOptions} communication_options - Protocol-specific communication parameters and settings (as strings for form input)
 * @property {File | undefined} device_image - Optional image file for the device (for visual identification in UI)
 * @property {string | undefined} current_image_url - Optional URL of the device's current image (for displaying existing images in forms)
 * @property {DeviceValidation} validation - Validation state for all device configuration properties
 */
export interface EditableDeviceMeter {
    connected: boolean;
    id: number;
    name: string;
    protocol: Protocol;
    type: MeterType;
    options: MeterOptions;
    communication_options: EditableCommunicationOptions;
    device_image: File | undefined;
    current_image_url: string | undefined;
    validation: DeviceValidation;
}

/**
 * Interface for creating a new device meter (device creation payload).
 * Used when adding a new device to the backend, omitting properties managed by the backend (id, connected).
 *
 * @interface NewDeviceMeter
 * @property {string} name - Human-readable name/label for the device (e.g., "Main Building Meter")
 * @property {Protocol} protocol - Communication protocol used by this device (MODBUS_RTU, OPC_UA, or NONE)
 * @property {MeterType} type - Electrical connection type (SINGLE_PHASE or THREE_PHASE)
 * @property {MeterOptions} options - Operational settings controlling measurement capabilities and data acquisition
 * @property {EditableCommunicationOptions} communication_options - Protocol-specific communication parameters and settings (as strings for form input)
 * @property {File | undefined} device_image - Optional image file for the device (for visual identification in UI)
 * @property {string | undefined} current_image_url - Optional URL of the device's current image (for displaying existing images in forms)
 * @property {DeviceValidation} validation - Validation state for all device configuration properties
 */
export interface NewDeviceMeter {
    name: string;
    protocol: Protocol;
    type: MeterType;
    options: MeterOptions;
    communication_options: EditableCommunicationOptions;
    device_image: File | undefined;
    current_image_url: string | undefined;
    validation: DeviceValidation;
}

/**
 * Represents the validation state for all editable properties of a device.
 * Each boolean property indicates whether the corresponding device configuration section passes validation.
 * Used to provide real-time feedback in the UI and prevent invalid device configurations from being saved.
 *
 * @interface
 * @property {boolean} deviceName - True if the device name is valid (non-empty, follows naming rules, etc.)
 * @property {boolean} deviceProtocol - True if the selected communication protocol is valid
 * @property {boolean} communicationOptions - True if all protocol-specific communication settings are valid
 * @property {boolean} meterOptions - True if all meter operational options are configured correctly
 * @property {boolean} nodes - True if all device nodes are properly configured and valid
 * @method isValid - Returns true if all validation checks pass (logical AND of all other properties)
 */
export interface DeviceValidation {
    deviceName: boolean;
    deviceProtocol: boolean;
    communicationOptions: boolean;
    meterOptions: boolean;
    nodes: boolean;
    isValid(): boolean;
}

/*****     T Y P E S     *****/

/**
 * Communication config for either OPC UA or Modbus RTU.
 */
export type CommunicationOptions = DeviceOPCUAConfig | DeviceModbusRTUConfig;

/**
 * Editable communication config for OPC UA or Modbus RTU (form input).
 */
export type EditableCommunicationOptions = EditableDeviceOPCUAConfig | EditableDeviceModbusRTUConfig;

/*****     O B J E C T S     *****/

/**
 * Default device options for initializing new device forms or objects.
 * Provides default protocol, meter type, and measurement options for convenience.
 */
export const defaultDeviceOptions = {
    protocol: Protocol.OPC_UA,
    type: MeterType.THREE_PHASE,
    options: {
        frequency_reading: true,
        negative_reactive_power: true,
        read_energy_from_meter: true,
        read_separate_forward_reverse_energy: false,
    } as MeterOptions,
};
