import { createLangStore } from "$lib/stores/lang/definition";
import type { TextsObject } from "$lib/stores/lang/definition";


//////////     B A U D R A T E     T E X T S     //////////

const generalAlertTextsObject: TextsObject = {
    decimalPlacesError: {
        PT: "O número de casas decimais deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The number of decimal places must be between {minValue} and {maxValue}.",
    },
    loggingPeriodError: {
        PT: "O período de registo deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The logging period must be between {minValue} and {maxValue}.",
    },
    slaveIDError: {
        PT: "O ID do dispositivo deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The device ID must be between {minValue} and {maxValue}.",
    },
    readPeriodError: {
        PT: "O período de leitura deve estar compreendido entre {minValue} e {maxValue} segundos.",
        EN: "The read period must be between {minValue} and {maxValue} seconds.",
    },
    commTimeoutError: {
        PT: "O tempo limite de comunicação deve estar compreendido entre {minValue} e {maxValue} segundos.",
        EN: "The communication timeout must be between {minValue} and {maxValue} seconds.",
    },
    retriesError: {
        PT: "O número de tentativas de reenvio deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The number of retries must be between {minValue} and {maxValue}.",
    },
    invalidDeviceName: {
        PT: "O nome do dispositivo é inválido.",
        EN: "The device name is invalid.",
    },
    invalidProtocol: {
        PT: "O protocolo de comunicação selecionado é inválido ou não suportado.",
        EN: "The selected communication protocol is invalid or not supported.",
    },
    invalidCommunicationOptions: {
        PT: "As opções relacionadas com a comunicação do dispositivo são inválidas.",
        EN: "The options related to device communication are invalid.",
    },
    invalidMeterOptions: {
        PT: "As opções relacionadas com o tipo e gestão do dispositivo são inválidas.",
        EN: "The options related to device type and management are invalid.",
    },
    invalidDeviceNodes: {
        PT: "Existem variáveis do dispositivo com configurações inválidas.",
        EN: "There are device variables with invalid configurations.",
    },
    errorEditDeviceParams: {
        PT: "Não foram atribuídos o nome e/ou o id do dispositivo.",
        EN: "The name and/or the id of the device were not assigned.",
    },
    noChangesToDevice: {
        PT: "Não foram efetuadas alterações às configurações do dispositivo. Não é necessário guardar a edição.",
        EN: "No changes were made to the device configuration. There is no need to save the edit.",
    },
    initNodesError: {
        PT: "Não foi possível iniciar corretamente a configuração das variáveis: {error}.",
        EN: "Could not properly initialize the variables configuration: {error}.",
    },
    invalidStartDate: {
        PT: "A data inicial é inválida. Use o formato YY/MM/DD.",
        EN: "The start date is invalid. Use YY/MM/DD format.",
    },
    invalidStartTime: {
        PT: "A hora inicial é inválida. Use o formato HH:mm.",
        EN: "The start time is invalid. Use HH:mm format.",
    },
    invalidEndDate: {
        PT: "A data final é inválida. Use o formato YY/MM/AAAA.",
        EN: "The end date is invalid. Use YY/MM/DD format.",
    },
    invalidEndTime: {
        PT: "A hora final é inválida. Use o formato HH:mm.",
        EN: "The end time is invalid. Use HH:mm format.",
    },
    invalidPeriodRange: {
        PT: "A data final deve ser posterior à data final.",
        EN: "The end date must be later than the initial date.",
    },
    noKeyError: {
        PT: "Erro desconhecido.",
        EN: "Unknown error."
    },
};

export const generalAlertTexts = createLangStore(generalAlertTextsObject);
