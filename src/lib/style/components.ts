import { writable } from "svelte/store";

// Type of the available styles
export type Style = 'dark';

export type ComponentStyles = {
    [K in Style]: {
        [property: string]: string;
    };
}

export const selectedStyle = writable<Style>("dark"); //Current selected style: starts with dark


/**
 * Gets a style property value from a ComponentStyles object for a specific theme.
 * @param style - The ComponentStyles object or null
 * @param property - The CSS property name to retrieve
 * @param theme - The theme style to use
 * @returns The property value as a string, or empty string if not found
 */
export function getStyle(style: ComponentStyles | null, property: string, theme: Style): string {
    if (!style) {
        return "";
    }

    return style[theme]?.[property] ?? "";
}

//////////     I N P U T     F I E L D     //////////

export const InputFieldStyle: ComponentStyles = {
    dark: {
        width: "100%",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#252b33",
        borderColor: "#323a45",
        disabledBackgroundColor: "#252b33",
        disabledBorderColor: "#323a45",
        selectedBackgroundColor: "#252b33",
        selectedBorderColor: "#2F80ED",
        badFormatBackgroundColor: "#252b33",
        badFormatBorderColor: "#e74c3c",
        paddingLeft: "10px",
        fontSize: "1rem",
        fontColor: "#f5f5f5",
        fontWeight: "400",
        textAlign: "center",
        infoTextColor: "#f5f5f5",
        infoTextSize: "0.9rem",
        infoTextWeight: "400",
        unitTextColor: "rgb(170,170,170)",
    }
}

//////////     S E L E C T O R     //////////

export const SelectorStyle: ComponentStyles = {
    dark: {
        width: "200px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#252b33",
        borderColor: "#323a45",
        disabledBackgroundColor: "#252b33",
        disabledBorderColor: "#252b33",
        selectedColor: "#14566b",
        badFormatBackgroundColor: "#252b33",
        badFormatBorderColor: "#e74c3c",
        optionsBackgroundColor: "#1e242b",
        optionsBorderColor: "#323a45",
        optionsInnerBorderColor: "transparent",
        optionHeight: "40px",
        fontSize: "1rem",
        letterSpacing: "0.5px",
        wordSpacing: "1px",
        arrowWidth: "16px",
        arrowHeight: "16px",
        arrowRightPos: "10px",
    }
}


//////////     H I N T     I N F O     //////////

export const HintInfoStyle: ComponentStyles = {
    dark: {
        hintWidth: "300px",
        hintHeight: "fit-content",
        textColor: "#f5f5f5",
        hintBackgroundColor: "#1e242b",
        hintBorderColor: "#2c343d",
        hintBorderRadius: "10px",
        openBackgroundColor: "rgba(255, 255, 255, 0.05)",
        openHoverBackgroundColor: "rgba(255, 255, 255, 0.1)",
        openStrokeColor: "#cccccc",
        openHoverStrokeColor: "#eeeeee",
        closeBackgroundColor: "rgba(255, 255, 255, 0.1)",
        closeHoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
        closeStrokeColor: "white",
        closeHoverStrokeColor: "#eeeeee",
    }
}