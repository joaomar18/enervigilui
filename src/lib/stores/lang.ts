import { writable, readable } from "svelte/store";

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
};

const textsObjectsVariables: TextsObject = {
    voltage: {
        PT: "Tensão",
        EN: "Voltage",
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
export const variableNameTexts = readable<TextsObject>(textsObjectsVariables);
