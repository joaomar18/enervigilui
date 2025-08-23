/**
 * Validates a Modbus register string ("0x" + 1-4 hex digits).
 * @param register Register string.
 * @returns True if valid.
 */
export function validateModbusRegister(register: string): boolean {
    // Check format: must be "0x" followed by 1-4 hex digits
    const modbusPattern = /^0x[0-9A-Fa-f]{1,4}$/;
    if (!modbusPattern.test(register)) {
        return false;
    }
    const value = parseInt(register.substring(2), 16);
    return value >= 0 && value <= 0xffff;
}
