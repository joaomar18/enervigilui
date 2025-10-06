import type { BaseNodeConfig, EditableBaseNodeConfig, BaseNodeAdditionalInfo } from "./base";

/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * OPC UA node configuration.
 * @property node_id Node identifier.
 */
export interface NodeOPCUAConfig extends BaseNodeConfig {
    node_id: string;
}

/**
 * Editable OPC UA node config for forms.
 * @property node_id Node identifier (string).
 */
export interface EditableNodeOPCUAConfig extends EditableBaseNodeConfig {
    node_id: string;
}

export interface OPCUANodeAdditionalInfo extends BaseNodeAdditionalInfo {
    node_id: string;
}

/*****     T Y P E S     *****/

/*****     O B J E C T S     *****/
