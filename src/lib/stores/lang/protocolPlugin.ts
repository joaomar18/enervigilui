import { createLangStore } from "$lib/stores/lang/definition";
import type { TextsObject } from "$lib/stores/lang/definition";

const textsObjectsPlugin: TextsObject = {
    noProtocol: {
        PT: "Sem protocolo",
        EN: "No protocol",
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

export const pluginTexts = createLangStore(textsObjectsPlugin);
