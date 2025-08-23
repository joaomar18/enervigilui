/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * Modbus RTU node configuration.
 * @property register Register address (number).
 */
export interface NodeModbusRTUConfig {
    register: number;
}

/**
 * Editable Modbus RTU node config for forms.
 * @property register Register address (string).
 */
export interface EditableNodeModbusRTUConfig {
    register: string;
}

/*****     T Y P E S     *****/

/*****     O B J E C T S     *****/
