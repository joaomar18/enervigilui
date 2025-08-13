import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";


//////////     A C T I O N     //////////

const ActionStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        borderColor: "#2a2e3a",
        hoverColor: "#2a2e3a",
        imageWidth: "25px",
        imageHeight: "25px",
    }
}

export const ActionStyle = createStyleStore(ActionStyleConfig);


//////////     A L E R T     //////////

const AlertStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "#a11f2a",
        borderColor: "#b91c1c",
        infoBackgroundColor: "#1e3a8a",
        infoBorderColor: "#1d4ed8",
        textColor: "#ffffff",
    }
}

export const AlertStyle = createStyleStore(AlertStyleConfig);


//////////     H I N T     I N F O     //////////

const HintInfoStyleConfig: ComponentStyles = {
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

export const HintInfoStyle = createStyleStore(HintInfoStyleConfig);


//////////     I N P U T     F I E L D     //////////

const InputFieldStyleConfig: ComponentStyles = {
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

export const InputFieldStyle = createStyleStore(InputFieldStyleConfig);

//////////     S E L E C T O R     //////////

const SelectorStyleConfig: ComponentStyles = {
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

export const SelectorStyle = createStyleStore(SelectorStyleConfig);