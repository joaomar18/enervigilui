import { createLangStore } from "$lib/stores/lang/definition";
import type { TextsObject } from "$lib/stores/lang/definition";

//////////     B A U D R A T E     T E X T S     //////////

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

//////////     P A R I T Y     T E X T S     //////////

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

//////////     B Y T E     S I Z E     T E X T S     //////////

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

//////////     S T O P     B I T S     T E X T S     //////////

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

export const baudrateTexts = createLangStore(textsObjectsBaudrates);
export const parityTexts = createLangStore(textsObjectsParities);
export const bytesizeTexts = createLangStore(textsObjectsBytesizes);
export const stopbitsTexts = createLangStore(textsObjectsStopbits);
