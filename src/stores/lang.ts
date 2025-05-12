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
    notFound: { PT: "Não encontrado", EN: "Not found" },
    title: { PT: "Bem-vindo", EN: "Welcome" },
    selectLanguage: { PT: "Selecione o seu idioma:", EN: "Select your language:" },
    infoMainMessage: {
        PT: "Monitorização de energia de código aberto\npara todos os dispositivos",
        EN: "Open-source energy monitoring\nfor every device",
    },
    infoSubMessage: {
        PT: "Criado para desenvolvedores, empresas e entusiastas",
        EN: "Built for developers, enterprises, and enthusiasts",
    },
    username: { PT: "Utilizador", EN: "Username" },
    password: { PT: "Palavra-passe", EN: "Password" },
    forgotPassword: { PT: "Esqueci-me da palavra-passe", EN: "Forgot my password" },
    login: { PT: "Entrar", EN: "Login" },
    register: { PT: "Registar", EN: "Register" },
    userInvalid: { PT: "Nome de utilizador inválido.", EN: "Invalid username." },
    userInfo: {
        PT: "O nome de utilizador deve conter pelo menos 3 caracteres sem espaços.",
        EN: "The username must contain at least 3 characters without spaces.",
    },
    passwordInvalid: { PT: "Palavra-passe inválida.", EN: "Invalid password." },
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
    keepSessionLogged: { PT: "Manter sessão iniciada", EN: "Stay logged in" },
    language: { PT: "Idioma", EN: "Language" },
    aboutUs: { PT: "Sobre Nós", EN: "About us" },
    help: { PT: "Ajuda", EN: "Help" },
    contacts: { PT: "Contactos", EN: "Contacts" },
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
};

export const texts = readable<TextsObject>(textsObject);
