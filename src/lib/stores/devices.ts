/**
 * Communication protocols supported by the energy monitoring system.
 * Defines the available protocols for communicating with external devices and systems.
 */
export enum Protocol {
    MODBUS_RTU = "MODBUS_RTU",
    OPC_UA = "OPC_UA",
    NONE = "NONE"
}

/**
 * Meter types supported by the energy monitoring system.
 * Defines the electrical connection types for energy metering and analysis.
 */
export enum MeterType {
    SINGLE_PHASE = "SINGLE_PHASE",
    THREE_PHASE = "THREE_PHASE"
}

/**
 * Configuration interface for Modbus RTU communication protocol.
 * Defines all the serial communication parameters required to establish
 * and maintain a connection with Modbus RTU devices.
 * 
 * @interface DeviceModbusRTUConfig
 * @property {number} baudrate - Data transmission rate in bits per second (e.g., 9600, 19200, 115200)
 * @property {number} bytesize - Number of data bits per character (typically 7 or 8)
 * @property {string} parity - Error checking method ("N" for None, "E" for Even, "O" for Odd)
 * @property {string} port - Serial communication port identifier (e.g., "COM1", "/dev/ttyUSB0")
 * @property {number} read_period - Time interval in seconds between consecutive data readings
 * @property {number} retries - Number of retry attempts for failed communication requests
 * @property {number} slave_id - Modbus slave device identifier (1-247)
 * @property {number} stopbits - Number of stop bits used to signal end of character (1 or 2)
 * @property {number} timeout - Maximum time in seconds to wait for device response
 */
export interface DeviceModbusRTUConfig {
    baudrate: number,
    bytesize: number,
    parity: string,
    port: string,
    read_period: number,
    retries: number,
    slave_id: number,
    stopbits: number,
    timeout: number,
}

/**
 * Editable configuration interface for Modbus RTU communication protocol.
 * This interface mirrors ModbusRTUConfig but uses string types for all properties
 * to support form input handling and validation before conversion to the final numeric types.
 * Used primarily in UI components where users input configuration values as text.
 */
export interface EditableDeviceModbusRTUConfig {
    baudrate: string,
    bytesize: string,
    parity: string,
    port: string,
    read_period: string,
    retries: string,
    slave_id: string,
    stopbits: string,
    timeout: string,
}

/**
 * Default configuration values for Modbus RTU communication options.
 * Provides sensible defaults for form initialization and new device creation.
 */
export const defaultModbusRTUOptions: EditableDeviceModbusRTUConfig = {
    port: "",
    slave_id: "1",
    baudrate: "9600",
    parity: "N",
    stopbits: "1",
    bytesize: "8",
    read_period: "10",
    timeout: "10",
    retries: "3",
};

/**
 * Configuration interface for OPC UA (OPC Unified Architecture) communication protocol.
 * Defines all the network communication parameters and authentication settings
 * required to establish and maintain a connection with OPC UA servers.
 * 
 * @interface DeviceOPCUAConfig
 * @property {string | null} username - Username for server authentication (null if no authentication required)
 * @property {string | null} password - Password for server authentication (null if no authentication required)
 * @property {number} read_period - Time interval in seconds between consecutive data readings from the server
 * @property {number} timeout - Maximum time in seconds to wait for server response before considering request failed
 * @property {string} url - OPC UA server endpoint URL (e.g., "opc.tcp://192.168.1.100:4840")
 */
export interface DeviceOPCUAConfig {
    username: string | null,
    password: string | null,
    read_period: number,
    timeout: number,
    url: string,
}

/**
 * Editable configuration interface for OPC UA communication protocol.
 * This interface mirrors OPCUAConfig but uses string types for all properties to support
 * form input handling and validation before conversion to the final types. Used primarily
 * in UI components where users input configuration values as text.
 */
export interface EditableDeviceOPCUAConfig {
    username: string,
    password: string,
    read_period: string,
    timeout: string,
    url: string,
}

/**
 * Default configuration values for OPC UA communication options.
 * Provides sensible defaults for form initialization and new device creation.
 */
export const defaultOPCUAOptions: EditableDeviceOPCUAConfig = {
    url: "opc.tcp://",
    read_period: "10",
    timeout: "10",
    username: "",
    password: "",
};

/**
 * Union type representing all possible communication configuration options.
 * This discriminated union allows a device to use either OPC UA or Modbus RTU
 * communication protocols, ensuring type safety while supporting multiple protocols.
 * 
 * @type CommunicationOptions
 * @description Use this type when a device configuration needs to support
 * multiple communication protocols. TypeScript will provide type checking
 * to ensure the correct configuration properties are used for each protocol.
 */
export type CommunicationOptions = DeviceOPCUAConfig | DeviceModbusRTUConfig;

/**
 * Union type representing all possible editable communication configuration options.
 * This discriminated union allows form inputs to handle either OPC UA or Modbus RTU
 * communication protocols using string types for all properties. Mirrors CommunicationOptions
 * but designed specifically for UI form handling and validation before type conversion.
 * 
 * @type EditableCommunicationOptions
 * @description Use this type in form components where users input device configuration
 * values as text. All numeric properties are represented as strings to support input
 * validation and error handling before converting to the final configuration types.
 */
export type EditableCommunicationOptions = EditableDeviceOPCUAConfig | EditableDeviceModbusRTUConfig;

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
    frequency_reading: boolean,
    negative_reactive_power: boolean,
    read_energy_from_meter: boolean,
    read_separate_forward_reverse_energy: boolean
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
    connected: boolean,
    id: number,
    name: string,
    protocol: Protocol,
    type: MeterType,
    options: MeterOptions,
    communication_options: CommunicationOptions;
}

/**
 * Editable device meter configuration interface.
 * This interface mirrors DeviceMeter but uses EditableCommunicationOptions to support
 * form input handling where communication parameters are entered as strings. Used primarily
 * in device configuration forms and editing components where user input validation is required.
 */
export interface EditableDeviceMeter {
    connected: boolean,
    id: number,
    name: string,
    protocol: Protocol,
    type: MeterType,
    options: MeterOptions,
    communication_options: EditableCommunicationOptions;
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
 */
export interface NewDeviceMeter {
    name: string,
    protocol: Protocol,
    type: MeterType,
    options: MeterOptions,
    communication_options: EditableCommunicationOptions;
}

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
    } as MeterOptions
}