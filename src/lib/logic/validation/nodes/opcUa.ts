/**
 * Validates an OPC UA node ID string.
 * @param node_id Node ID string.
 * @returns True if valid.
 */
export function validateOpcUaNodeId(node_id: string): boolean {
    const opcuaPattern = /^ns=\d+;(i=\d+|s=[^;]+|g=[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}|b=[A-Za-z0-9+/=]+)$/;
    return opcuaPattern.test(node_id);
}
