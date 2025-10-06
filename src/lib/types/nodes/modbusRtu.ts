import type { BaseNodeAdditionalInfo, BaseNodeConfig, EditableBaseNodeConfig } from "./base";

/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * Modbus RTU node configuration.
 * @property register Register address (number).
 */
export interface NodeModbusRTUConfig extends BaseNodeConfig {
    register: number;
}

/**
 * Editable Modbus RTU node config for forms.
 * @property register Register address (string).
 */
export interface EditableNodeModbusRTUConfig extends EditableBaseNodeConfig {
    register: string;
}

export interface ModbusRTUNodeAdditionalInfo extends BaseNodeAdditionalInfo {
    register: number;
}

/*****     T Y P E S     *****/

/*****     O B J E C T S     *****/
