import { writable, readable, derived } from "svelte/store";
import { defaultVariables, NodePhase } from "./nodes";

// Type for the available languages
export type Language = "PT" | "EN";

// Type of the Texts Object
export interface TextsObject {
    [key: string]: {
        PT: string;
        EN: string;
    };
}

export const selectedLang = writable<Language>("PT"); //Current selected language: Starts with PT - Portuguese

//////////     G E N E R A L     T E X T S     //////////

const textsObject: TextsObject = {
    notFound: {
        PT: "Não encontrado",
        EN: "Not found",
    },
    title: {
        PT: "Bem-vindo",
        EN: "Welcome",
    },
    selectLanguage: {
        PT: "Selecione o seu idioma:",
        EN: "Select your language:",
    },
    infoMainMessage: {
        PT: "Monitorização de energia de código aberto\npara todos os dispositivos",
        EN: "Open-source energy monitoring\nfor every device",
    },
    infoSubMessage: {
        PT: "Criado para desenvolvedores, empresas e entusiastas",
        EN: "Built for developers, enterprises, and enthusiasts",
    },
    username: {
        PT: "Utilizador",
        EN: "Username",
    },
    password: {
        PT: "Palavra-passe",
        EN: "Password",
    },
    forgotPassword: {
        PT: "Esqueci-me da palavra-passe",
        EN: "Forgot my password",
    },
    login: {
        PT: "Entrar",
        EN: "Login",
    },
    register: {
        PT: "Registar",
        EN: "Register",
    },
    userInvalid: {
        PT: "Nome de utilizador inválido.",
        EN: "Invalid username.",
    },
    userInfo: {
        PT: "O nome de utilizador deve conter pelo menos 3 caracteres sem espaços.",
        EN: "The username must contain at least 3 characters without spaces.",
    },
    passwordInvalid: {
        PT: "Palavra-passe inválida.",
        EN: "Invalid password.",
    },
    passwordInfo: {
        PT: "A palavra-passe deve conter pelo menos 5 caracteres sem espaços.",
        EN: "The password must contain at least 5 characters without spaces.",
    },
    wrongCredentials: {
        PT: "O nome de utilizador e/ou a palavra-passe estão incorretos. Tentativas restantes:",
        EN: "The username and/or password are incorrect. Remaining tries:",
    },
    timeout: {
        PT: "O servidor não respondeu ao pedido.",
        EN: "The server did not respond to the request.",
    },
    tooManyAttempts01: {
        PT: "O servidor bloqueou este endereço até às",
        EN: "The server has blocked this address until",
    },
    tooManyAttempts02: {
        PT: "devido a demasiadas tentativas inválidas.",
        EN: "due to too many invalid attempts.",
    },
    unknownError: {
        PT: "O servidor encontrou um erro fatal no pedido. Por favor contacte o administrador do sistema.",
        EN: "The server encountered a fatal error in the request. Please contact your system administrator.",
    },
    keepSessionLogged: {
        PT: "Manter sessão iniciada",
        EN: "Stay logged in",
    },
    language: {
        PT: "Idioma",
        EN: "Language",
    },
    aboutUs: {
        PT: "Sobre Nós",
        EN: "About us",
    },
    help: {
        PT: "Ajuda",
        EN: "Help",
    },
    contacts: {
        PT: "Contactos",
        EN: "Contacts",
    },
    unexpectedError: {
        PT: "Ocorreu um erro inesperado. Por favor tente mais tarde.",
        EN: "An unexpected error occurred. Please try again.",
    },
    devices: {
        PT: "Dispositivos",
        EN: "Devices",
    },
    general: {
        PT: "Geral",
        EN: "General",
    },
    diagnostics: {
        PT: "Diagnóstico",
        EN: "Diagnostics",
    },
    health: {
        PT: "Estado",
        EN: "Health",
    },
    logs: {
        PT: "Registros",
        EN: "Logs",
    },
    system: {
        PT: "Sistema",
        EN: "System",
    },
    settings: {
        PT: "Definições",
        EN: "Settings",
    },
    backup: {
        PT: "Backup",
        EN: "Backup",
    },
    logout: {
        PT: "Sair",
        EN: "Logout",
    },
    searchDevice: {
        PT: "Pesquisar dispositivo",
        EN: "Search device",
    },
    connected: {
        PT: "conectado",
        EN: "connected",
    },
    disconnected: {
        PT: "desconectado",
        EN: "disconnected",
    },
    addDevice: {
        PT: "Adicionar dispositivo",
        EN: "Add device",
    },
    errorDevicesState: {
        PT: "Não foi possível obter o estado dos dispositivos do servidor.",
        EN: "Could not obtain devices status from the server.",
    },
    errorDeviceConfig: {
        PT: "Não foi possível obter a configuração para o dispositivo do servidor.",
        EN: "Could not obtain device configuration from the server.",
    },
    errorDeviceNodesConfig: {
        PT: "Não foi possível obter a configuração das variáveis para o dispositivo do servidor.",
        EN: "Could not obtain device variables configuration from the server.",
    },
    errorEditDeviceParams: {
        PT: "Não foram atribuídos o nome e/ou o id do dispositivo.",
        EN: "The name and/or the id of the device were not assigned.",
    },
    deviceCommunication: {
        PT: "Comunicação do Dispositivo",
        EN: "Device Communication",
    },
    deviceCommunicationSub: {
        PT: "Opções relacionadas com a comunicação do dispositivo",
        EN: "Options related to device communication",
    },
    deviceOptions: {
        PT: "Opções do Dispositivo",
        EN: "Device Options",
    },
    deviceOptionsSub: {
        PT: "Opções relacionadas com o tipo e gestão do dispositivo",
        EN: "Options related to device type and management",
    },
    communicationProtocol: {
        PT: "Protocolo de Comunicação",
        EN: "Communication Protocol",
    },
    communicationProtocolInfo: {
        PT: "Protocolo de comunicação utilizado para obter dados do dispositivo.",
        EN: "Communication protocol used to obtain data from the device.",
    },
    connectionType: {
        PT: "Tipo de Conexão",
        EN: "Connection Type",
    },
    connectionTypeInfo: {
        PT: "Tipo de conexão elétrica para medição e análise de energia.",
        EN: "Electrical connection type for energy metering and analysis.",
    },
    readEnergyFromMeter: {
        PT: "Obter leitura de energia do dispositivo",
        EN: "Get energy reading from device",
    },
    readEnergyFromMeterInfo: {
        PT: "Opção para valores de energia serem obtidos a partir do dispositivo.",
        EN: "Option for energy readings to be obtained from the device.",
    },
    readForwardReverseEnergySeparate: {
        PT: "Leitura de energia direta e inversa separada",
        EN: "Separate forward and reverse energy reading",
    },
    readForwardReverseEnergySeparateInfo: {
        PT: "Opção para definir se o dispositivo comunica os valores de energia diretos e inversos separados.",
        EN: "Option to define whether the device sends separate forward and reverse energy values.",
    },
    negativeReactivePower: {
        PT: "Potência reativa negativa",
        EN: "Negative reactive power",
    },
    negativeReactivePowerInfo: {
        PT: "Opção para definir se o dispositivo define valores de potência reativa negativos para fatores de potência adiantados.",
        EN: "Option to define whether the device sets negative reactive power values ​​for leading power factors.",
    },
    frequencyReading: {
        PT: "Leitura de frequência",
        EN: "Frequency reading",
    },
    frequencyReadingInfo: {
        PT: "Opção para definir se o dispotivo permite a leitura de valores de frequência.",
        EN: "Option to define whether the device allows reading frequency values.",
    },
    deviceNodes: {
        PT: "Variáveis do Dispositivo",
        EN: "Device Variables",
    },
    deviceNodesSub: {
        PT: "Configuração dos valores de medição do dispositivo",
        EN: "Measurement values configuration on the device",
    },
    confirm: {
        PT: "Confirmar",
        EN: "Confirm",
    },
    save: {
        PT: "Guardar",
        EN: "Save",
    },
    delete: {
        PT: "Eliminar",
        EN: "Delete",
    },
    cancel: {
        PT: "Cancelar",
        EN: "Cancel",
    },
    deleteDevice: {
        PT: "Eliminar o dispositivo",
        EN: "Delete device",
    },
    deleteDeviceInfo: {
        PT: "Eliminar o dispositivo irá remover permanentemente todos os dados associados. Tem a certeza que pretende continuar?",
        EN: "Deleting the device will permanently remove all associated data. Are you sure you want to continue?",
    },
    confirmDeleteDevice: {
        PT: "Digite o nome do dispositivo para confirmar",
        EN: "Type the device name to confirm",
    },
    saveDevice: {
        PT: "Aplicar as alterações ao dispositivo",
        EN: "Apply changes to the device",
    },
    saveDeviceInfo: {
        PT: "Aplicar as alterações irá atualizar as configurações do dispositivo. Tem a certeza que pretende continuar?",
        EN: "Applying changes will update the device settings. Are you sure you want to continue?",
    },
    networkAddress: {
        PT: "Endereço de Rede",
        EN: "Network Address",
    },
    networkAddressInfo: {
        PT: "O endereço de rede utilizado para estabelecer comunicação com o dispositivo.",
        EN: "Network address used to establish communication with the device.",
    },
    readPeriod: {
        PT: "Período de Leitura",
        EN: "Read Period",
    },
    readPeriodInfo: {
        PT: "Intervalo de tempo (em segundos) entre as leituras de dados do dispositivo.",
        EN: "Time interval (in seconds) between data readings from the device.",
    },
    commTimeout: {
        PT: "Tempo Limite de Comunicação",
        EN: "Communication Timeout",
    },
    commTimeoutInfo: {
        PT: "Tempo máximo (em segundos) que o sistema aguarda por uma resposta do dispositivo antes de considerar que a comunicação falhou.",
        EN: "Maximum time (in seconds) that the system waits for a response from the device before considering that communication failed.",
    },

    authenticationOptional: {
        PT: "Autenticação (opcional)",
        EN: "Authentication (optional)",
    },
    commUsernameInfo: {
        PT: "Nome de utilizador para autenticação em dispositivos que requerem credenciais. Deixe em branco se o dispositivo não necessitar de autenticação.",
        EN: "Username for authentication on devices that require credentials. Leave blank if the device does not require authentication.",
    },
    commPasswordInfo: {
        PT: "Palavra-passe para autenticação em dispositivos que requerem credenciais. Deixe em branco se o dispositivo não necessitar de autenticação.",
        EN: "Password for authentication on devices that require credentials. Leave blank if the device does not require authentication.",
    },
    secondsUnit: {
        PT: "seg.",
        EN: "sec.",
    },
    readPeriodError: {
        PT: "O período de leitura deve estar compreendido entre {minValue} e {maxValue} segundos.",
        EN: "The read period must be between {minValue} and {maxValue} seconds.",
    },
    commTimeoutError: {
        PT: "O tempo limite de comunicação deve estar compreendido entre {minValue} e {maxValue} segundos.",
        EN: "The communication timeout must be between {minValue} and {maxValue} seconds.",
    },
    communicationPort: {
        PT: "Porta de Comunicação",
        EN: "Communication Port",
    },
    communicationPortInfo: {
        PT: "A porta de comunicação utilizada para estabelecer a ligação com o dispositivo.",
        EN: "The communication port used to establish the connection with the device.",
    },
    slaveID: {
        PT: "ID do Dispositivo",
        EN: "Device ID",
    },
    slaveIDInfo: {
        PT: "Identificador único do dispositivo na rede Modbus. Deve ser um número entre 1 e 247.",
        EN: "Unique identifier of the device on the Modbus network. Must be a number between 1 and 247.",
    },
    slaveIDError: {
        PT: "O ID do dispositivo deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The device ID must be between {minValue} and {maxValue}.",
    },
    baudrate: {
        PT: "Baudrate",
        EN: "Baudrate",
    },
    baudrateInfo: {
        PT: "A taxa de transmissão de dados utilizada na comunicação com o dispositivo.",
        EN: "The data transmission rate used in communication with the device.",
    },
    parity: {
        PT: "Paridade",
        EN: "Parity",
    },
    parityInfo: {
        PT: "O método de verificação de erros utilizado na comunicação com o dispositivo.",
        EN: "The error checking method used in communication with the device.",
    },
    bytesize: {
        PT: "Tamanho do Byte (bits)",
        EN: "Byte Size (bits)",
    },
    bytesizeInfo: {
        PT: "O tamanho do byte (em bits) utilizado na comunicação com o dispositivo.",
        EN: "The byte size (in bits) used in communication with the device.",
    },
    stopbits: {
        PT: "Bits de Paragem",
        EN: "Stop Bits",
    },
    stopbitsInfo: {
        PT: "O número de bits de paragem utilizados na comunicação com o dispositivo.",
        EN: "The number of stop bits used in communication with the device.",
    },
    retries: {
        PT: "Tentativas de Reenvio",
        EN: "Retries Number",
    },
    retriesInfo: {
        PT: "O número de tentativas de reenvio em caso de falha na comunicação com o dispositivo.",
        EN: "The number of retries in case of communication failure with the device.",
    },
    retriesError: {
        PT: "O número de tentativas de reenvio deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The number of retries must be between {minValue} and {maxValue}.",
    },
    variable: {
        PT: "Variável",
        EN: "Variable",
    },
    type: {
        PT: "Tipo",
        EN: "Type",
    },
    unit: {
        PT: "Unidade",
        EN: "Unit",
    },
    opcuaID: {
        PT: "ID OPC UA",
        EN: "OPC UA ID",
    },
    modbusRegister: {
        PT: "Registo Modbus",
        EN: "Modbus Register",
    },
    custom: {
        PT: "Próprio",
        EN: "Custom",
    },
    publish: {
        PT: "Publicar",
        EN: "Publish",
    },
    loggingPeriod: {
        PT: "Período de Registo",
        EN: "Logging Period",
    },
    virtual: {
        PT: "Virtual",
        EN: "Virtual",
    },
    logging: {
        PT: "Registo",
        EN: "Logging",
    },
    minAlarm: {
        PT: "Minimo",
        EN: "Minimum",
    },
    maxAlarm: {
        PT: "Máximo",
        EN: "Maximum",
    },
    enabled: {
        PT: "Ativar",
        EN: "Enabled",
    },
    l1Phase: {
        PT: "Fase L1",
        EN: "L1 Phase",
    },
    l2Phase: {
        PT: "Fase L2",
        EN: "L2 Phase",
    },
    l3Phase: {
        PT: "Fase L3",
        EN: "L3 Phase",
    },
    total: {
        PT: "Total",
        EN: "Total",
    },
    addNode: {
        PT: "Adicionar Variável",
        EN: "Add Variable",
    },
    actions: {
        PT: "Ações",
        EN: "Actions",
    },
    loggingPeriodError: {
        PT: "O período de registo deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The logging period must be between {minValue} and {maxValue}.",
    },
    minValue: {
        PT: "Valor Mínimo",
        EN: "Minimum Value",
    },
    maxValue: {
        PT: "Valor Máximo",
        EN: "Maximum Value",
    },
    section: {
        PT: "Secção",
        EN: "Section",
    },
    protocol: {
        PT: "Protocolo",
        EN: "Protocol",
    },
    l1: {
        PT: "L1",
        EN: "L1",
    },
    l2: {
        PT: "L2",
        EN: "L2",
    },
    l3: {
        PT: "L3",
        EN: "L3",
    },
    singlephase: {
        PT: "Monofásico",
        EN: "Single-phase",
    },
    incrementalNode: {
        PT: "Variável Incremental",
        EN: "Incremental Variable",
    },
    positiveIncrement: {
        PT: "Incremento Positivo",
        EN: "Positive Increment",
    },
    calculateIncrement: {
        PT: "Calcular Incremento",
        EN: "Calculate Increment",
    },
    variableInfo: {
        PT: "Selecione a variável que pretende medir ou monitorizar. Cada variável representa um tipo de dado elétrico, como tensão, corrente, potência, energia, etc.",
        EN: "Select the variable you want to measure or monitor. Each variable represents a type of electrical data, such as voltage, current, power, energy, etc."
    },
    variableCustomInfo: {
        PT: "Defina um nome personalizado para a variável. Use esta opção para variáveis que não se enquadram nas categorias pré-definidas.",
        EN: "Set a custom name for the variable. Use this option for variables that do not fit into the predefined categories.",
    },
    unitInfo: {
        PT: "Indique a unidade de medida associada à variável (por exemplo: V, A, kWh, %). Certifique-se de que a unidade corresponde ao tipo de dado selecionado.",
        EN: "Specify the measurement unit associated with the variable (e.g., V, A, kWh, %). Make sure the unit matches the selected data type.",
    },
    unitCustomInfo: {
        PT: "Indique a unidade de medida para esta variável personalizada (ex: rpm, %, m³, etc.).",
        EN: "Specify the measurement unit for this custom variable (e.g., rpm, %, m³, etc.).",
    },
    nodespaceInfo: {
        PT: "Indique o ID OPC UA utilizado para aceder à variável no dispositivo.",
        EN: "Specify the OPC UA ID used to acess the variable on the device.",
    },
    registerInfo: {
        PT: "Indique o registo modbus utilizado para aceder à variável no dispositivo.",
        EN: "Specify the modbus register used to access the variable on the device.",
    },
    nocommInfo: {
        PT: "Esta variável é virtual e não possui registo de comunicação ou identificador associado.",
        EN: "This variable is virtual and does not have a communication register or identifier.",
    },
    typeInfo: {
        PT: "Selecione o tipo de dado da variável: FLOAT (número decimal), INT (número inteiro), STRING (texto) ou BOOLEAN (verdadeiro/falso).",
        EN: "Select the variable data type: FLOAT (decimal number), INT (integer number), STRING (text), or BOOLEAN (true/false).",
    },
    loggingInfo: {
        PT: "Defina o período de registo (em minutos) para guardar periodicamente os dados desta variável. Ative ou desative o registo utilizando a caixa de seleção.",
        EN: "Set the logging period (in minutes) to store this variable's data periodically. Enable or disable logging using the checkbox.",
    },
    minValueInfo: {
        PT: "Defina o valor mínimo permitido para esta variável. O sistema irá sinalizar se o valor medido for inferior a este limite. Ative ou desative esta função utilizando a caixa de seleção.",
        EN: "Set the minimum allowed value for this variable. The system will alert if the measured value falls below this limit. Enable or disable this function using the checkbox.",
    },
    maxValueInfo: {
        PT: "Defina o valor máximo permitido para esta variável. O sistema irá sinalizar se o valor medido exceder este limite. Ative ou desative esta função utilizando a caixa de seleção.",
        EN: "Set the maximum allowed value for this variable. The system will alert if the measured value exceeds this limit. Enable or disable this function using the checkbox.",
    },
    customInfo: {
        PT: "Ative esta opção para definir a variável como personalizada (definida pelo utilizador) em vez de uma variável padrão do sistema.",
        EN: "Enable this option to set the variable as custom (user-defined) instead of a system default variable.",
    },
    publishInfo: {
        PT: "Ative esta opção para permitir que a variável seja acedida externamente (por outras aplicações ou sistemas).",
        EN: "Enable this option to allow the variable to be accessed externally (by other applications or systems).",
    },
    virtualInfo: {
        PT: "Esta opção indica que a variável é calculada internamente pelo sistema e não está disponível para variáveis personalizadas.",
        EN: "This option indicates that the variable is calculated internally by the system and is not available for custom variables.",
    },
    incrementalNodeInfo: {
        PT: "Esta opção indica que a variável é incremental, acumulando o seu valor ao longo do tempo. O valor acumulado é reiniciado a cada registo. Exemplo: variáveis de energia.",
        EN: "This option indicates that the node is incremental, accumulating its value over time. The accumulated value resets on each logging. Example: energy nodes.",
    },
    positiveIncrementInfo: {
        PT: "Quando ativado: acumulação = acumulação + novo valor. Quando desativado: acumulação = novo valor - valor inicial.",
        EN: "If enabled: accumulation = accumulation + new value. If not: accumulation = new value - initial value.",
    },
    calculateIncrementInfo: {
        PT: "Ative para calcular o incremento entre leituras. Se desativado, a variável não calcula a acumulação (será incremental, mas calculada externamente).",
        EN: "Enable to calculate the increment between readings. If off, the variable will not calculate its own accumulation (it remains incremental, but is likely calculated externally).",
    },
    enabledInfo: {
        PT: "Ative para que a variável seja gerida. Se desativada, a variável apenas existe na configuração e não é processada.",
        EN: "Enable for the variable to be managed. If disabled, the variable only exists in the configuration and is not processed.",
    },
    decimalPlaces: {
        PT: "Número de casas decimais",
        EN: "Number of decimal places",
    },
    decimalPlacesInfo: {
        PT: "Defina o número de casas decimais para apresentar os valores desta variável. Use para ajustar a precisão da visualização.",
        EN: "Set the number of decimal places to display for this variable's values. Use to adjust the precision of visualization",
    },
    decimalPlacesError: {
        PT: "O número de casas decimais deve estar compreendido entre {minValue} e {maxValue}.",
        EN: "The number of decimal places must be between {minValue} and {maxValue}.",
    },
    deviceName: {
        PT: "Nome do dispositivo",
        EN: "Device name",
    },
    add: {
        PT: "Adicionar",
        EN: "Add",
    },
    addNewDevice: {
        PT: "Adicionar novo dispositivo",
        EN: "Add new device",
    },
    addNewDeviceInfo: {
        PT: "Confirmar a adição irá criar um novo dispositivo. Tem a certeza que pretende continuar?",
        EN: "Confirming will create a new device. Are you sure you want to continue?",
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

};

//////////     D E V I C E     T E X T S     //////////

const textsObjectsProtocols: TextsObject = {
    OPC_UA: {
        PT: "OPC UA",
        EN: "OPC UA",
    },
    MODBUS_RTU: {
        PT: "MODBUS RTU",
        EN: "MODBUS RTU",
    },
};

const textsObjectsConnectionTypes: TextsObject = {
    SINGLE_PHASE: {
        PT: "1F",
        EN: "1F",
    },
    THREE_PHASE: {
        PT: "3F",
        EN: "3F",
    },
};

const textsObjectsBaudrates: TextsObject = {
    "1200": {
        PT: "1200",
        EN: "1200",
    },
    "2400": {
        PT: "2400",
        EN: "2400",
    },
    "4800": {
        PT: "4800",
        EN: "4800",
    },
    "9600": {
        PT: "9600",
        EN: "9600",
    },
    "19200": {
        PT: "19200",
        EN: "19200",
    },
    "38400": {
        PT: "38400",
        EN: "38400",
    },
    "57600": {
        PT: "57600",
        EN: "57600",
    },
    "115200": {
        PT: "115200",
        EN: "115200",
    },
};

const textsObjectsParities: TextsObject = {
    N: {
        PT: "Nenhuma",
        EN: "None",
    },
    E: {
        PT: "Par",
        EN: "Even",
    },
    O: {
        PT: "Impar",
        EN: "Odd",
    },
};

const textsObjectsBytesizes: TextsObject = {
    "7": {
        PT: "7",
        EN: "7",
    },
    "8": {
        PT: "8",
        EN: "8",
    },
};

const textsObjectsStopbits: TextsObject = {
    "1": {
        PT: "1",
        EN: "1",
    },
    "2": {
        PT: "2",
        EN: "2",
    },
};

//////////     V A R I A B L E S     T E X T S     //////////

const textsObjectsVariables: TextsObject = {
    voltage: {
        PT: "Tensão",
        EN: "Voltage",
    },
    l1_l2_voltage: {
        PT: "Tensão L1-L2",
        EN: "L1-L2 Voltage",
    },
    l2_l3_voltage: {
        PT: "Tensão L2-L3",
        EN: "L2-L3 Voltage",
    },
    l3_l1_voltage: {
        PT: "Tensão L3-L1",
        EN: "L3-L1 Voltage",
    },
    current: {
        PT: "Corrente",
        EN: "Current",
    },
    active_power: {
        PT: "Potência Ativa",
        EN: "Active Power",
    },
    reactive_power: {
        PT: "Potência Reativa",
        EN: "Reactive Power",
    },
    apparent_power: {
        PT: "Potência Aparente",
        EN: "Apparent Power",
    },
    power_factor: {
        PT: "Fator de Potência",
        EN: "Power Factor",
    },
    power_factor_direction: {
        PT: "Direção do Fator de Potência",
        EN: "Power Factor Direction",
    },
    frequency: {
        PT: "Frequência",
        EN: "Frequency",
    },
    active_energy: {
        PT: "Energia Ativa",
        EN: "Active Energy",
    },
    reactive_energy: {
        PT: "Energia Reativa",
        EN: "Reactive Energy",
    },
    forward_active_energy: {
        PT: "Energia Ativa Direta",
        EN: "Forward Active Energy",
    },
    forward_reactive_energy: {
        PT: "Energia Reativa Direta",
        EN: "Forward Reactive Energy",
    },
    reverse_active_energy: {
        PT: "Energia Ativa Inversa",
        EN: "Reverse Active Energy",
    },
    reverse_reactive_energy: {
        PT: "Energia Reativa Inversa",
        EN: "Reverse Reactive Energy",
    },
};

export const texts = readable<TextsObject>(textsObject);
export const protocolTexts = readable<TextsObject>(textsObjectsProtocols);
export const meterTypeTexts = readable<TextsObject>(textsObjectsConnectionTypes);
export const baudrateTexts = readable<TextsObject>(textsObjectsBaudrates);
export const parityTexts = readable<TextsObject>(textsObjectsParities);
export const bytesizeTexts = readable<TextsObject>(textsObjectsBytesizes);
export const stopbitsTexts = readable<TextsObject>(textsObjectsStopbits);
export const variableNameTexts = readable<TextsObject>(textsObjectsVariables);

/**
 * A derived store that filters variable name texts by their applicable phases.
 * Returns an object where each key is a phase (e.g., "L1", "L2", "L3", "Total", "") 
 * and each value is a TextsObject containing only the variable names that can be applied to that phase.
 * Useful for creating phase-specific variable selectors with proper translations.
 */
export const variableNameTextsByPhase = derived(
    [defaultVariables],
    ([$defaultVariables]) => {
        const phaseMap: Record<string, TextsObject> = {};

        // Initialize all phases
        Object.values(NodePhase).forEach(phase => {
            phaseMap[phase] = {};
        });

        $defaultVariables.forEach((variable) => {
            variable.applicablePhases.forEach(phase => {
                if (textsObjectsVariables[variable.name]) {
                    phaseMap[phase][variable.name] = textsObjectsVariables[variable.name];
                }
            });
        });

        return phaseMap;
    }
);
