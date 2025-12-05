import { createLangStore } from "$lib/stores/lang/definition";
import type { TextsObject } from "$lib/stores/lang/definition";

const textsObjectsPlugin: TextsObject = {
    noProtocol: {
        PT: "Sem protocolo",
        EN: "No protocol",
    },
    address: {
        PT: "Endereço",
        EN: "Address",
    },
    noProtocolInfo: {
        PT: "Sem protocolo de comunicação selecionado.",
        EN: "No communication protocol selected.",
    },
    modbusRegister: {
        PT: "Registo Modbus",
        EN: "Modbus Register",
    },
    registerInfo: {
        PT: "Indique o registo modbus utilizado para aceder à variável no dispositivo.",
        EN: "Specify the modbus register used to access the variable on the device.",
    },
    opcuaID: {
        PT: "ID OPC UA",
        EN: "OPC UA ID",
    },
    nodespaceInfo: {
        PT: "Indique o ID OPC UA utilizado para aceder à variável no dispositivo.",
        EN: "Specify the OPC UA ID used to acess the variable on the device.",
    },
};

const textsObjectsNoProtocolNodeType: TextsObject = {
    FLOAT: {
        PT: "FLOAT",
        EN: "FLOAT",
    },
    STRING: {
        PT: "STRING",
        EN: "STRING",
    },
    INT: {
        PT: "INT",
        EN: "INT",
    },
    BOOLEAN: {
        PT: "BOOLEAN",
        EN: "BOOLEAN",
    },
};

export const pluginTexts = createLangStore(textsObjectsPlugin);
export const noProtocolNodeTypeTexts = createLangStore(textsObjectsNoProtocolNodeType);
