import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     D E F A U L T     B U T T O N     //////////

const DefaultButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "250px",
        height: "50px",
        borderRadius: "5px",
        backgroundColor: "#232528",
        disabledBackgroundColor: "#232528",
        borderColor: "#8A8C91",
        disabledBorderColor: "#8A8C91",
        hoverColor: "#2C2E34",
        disabledHoverColor: "#2C2E34",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "22px",
        imageHeight: "22px",
        imageRightPos: "auto",
        imageLeftPos: "20px",

    }
}

export const DefaultButtonStyle = createStyleStore(DefaultButtonStyleConfig);


//////////     S U B     D E F A U L T     B U T T O N     //////////

const SubDefaultButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#3a3a3a",
        disabledBackgroundColor: "#3a3a3a",
        borderColor: "#5c5c5c",
        disabledBorderColor: "#5c5c5c",
        hoverColor: "#4b4b4b",
        disabledHoverColor: "#4b4b4b",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
    }
}

export const SubDefaultButtonStyle = createStyleStore(SubDefaultButtonStyleConfig);


//////////     P R I M A R Y     B U T T O N     //////////

const PrimaryButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "250px",
        height: "50px",
        borderRadius: "5px",
        backgroundColor: "#1a2233",
        disabledBackgroundColor: "#282828",
        borderColor: "#2F80ED",
        disabledBorderColor: "#444444",
        hoverColor: "#203046",
        disabledHoverColor: "#282828",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "22px",
        imageHeight: "22px",
        imageRightPos: "auto",
        imageLeftPos: "20px",

    }
}

export const PrimaryButtonStyle = createStyleStore(PrimaryButtonStyleConfig);


//////////     S U B     P R I M A R Y     B U T T O N     //////////

const SubPrimaryButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#2F80ED",
        disabledBackgroundColor: "#7da5d9",
        borderColor: "#1456B0",
        disabledBorderColor: "#6287b6",
        hoverColor: "#1C6DD0",
        disabledHoverColor: "#7da5d9",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
    }
}

export const SubPrimaryButtonStyle = createStyleStore(SubPrimaryButtonStyleConfig);


//////////     D A N G E R     B U T T O N     //////////

const DangerButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "250px",
        height: "50px",
        borderRadius: "5px",
        backgroundColor: "#23171a",
        disabledBackgroundColor: "#282828",
        borderColor: "#FF3B30",
        disabledBorderColor: "#444444",
        hoverColor: "#3b181a",
        disabledHoverColor: "#282828",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "22px",
        imageHeight: "22px",
        imageRightPos: "auto",
        imageLeftPos: "20px",

    }
}

export const DangerButtonStyle = createStyleStore(DangerButtonStyleConfig);


//////////     S U B     D A N G E R     B U T T O N     //////////

const SubDangerButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#E74C3C",
        disabledBackgroundColor: "#3a2323",
        borderColor: "#A93226",
        disabledBorderColor: "#5a3a3a",
        hoverColor: "#C0392B",
        disabledHoverColor: "#2a1818",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
    }
}

export const SubDangerButtonStyle = createStyleStore(SubDangerButtonStyleConfig);

//////////     S U C E S S     B U T T O N     //////////

const SucessButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "250px",
        height: "50px",
        borderRadius: "5px",
        backgroundColor: "#16281a",
        disabledBackgroundColor: "#282828",
        borderColor: "#1a8d46",
        disabledBorderColor: "#444444",
        hoverColor: "#1c3922",
        disabledHoverColor: "#282828",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "22px",
        imageHeight: "22px",
        imageRightPos: "auto",
        imageLeftPos: "20px",

    }
}

export const SucessButtonStyle = createStyleStore(SucessButtonStyleConfig);


//////////     S U B     D A N G E R     B U T T O N     //////////

const SubSucessButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#1a8d46",
        disabledBackgroundColor: "#6a8d76",
        borderColor: "#145a36",
        disabledBorderColor: "#55705d",
        hoverColor: "#17673a",
        disabledHoverColor: "#6a8d76",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "1rem",
        fontWeight: "400",
    }
}

export const SubSucessButtonStyle = createStyleStore(SubSucessButtonStyleConfig);
