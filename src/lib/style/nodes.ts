import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     A D D     N O D E     //////////

const AddNodeStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
};

export const AddNodeStyle = createStyleStore(AddNodeStyleConfig);

//////////     A D D     N O D E     B U T T O N     //////////

const AddNodeButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        borderRadius: "0px",
        backgroundColor: "#1a2027",
        disabledBackgroundColor: "#1a2027",
        borderColor: "#1a2027",
        disabledBorderColor: "#1a2027",
        hoverColor: "#1f242b",
        disabledHoverColor: "#1f242b",
        fontColor: "#f5f5f5",
        disabledFontColor: "#f5f5f5",
        fontSize: "0.9rem",
        fontWeight: "400",
    },
};

export const AddNodeButtonStyle = createStyleStore(AddNodeButtonStyleConfig);

//////////     N O D E     C O N F I G U R A T I O N     W I N D O W     //////////

const NodeConfigWindowStyleConfig: ComponentStyles = {
    dark: {
        headerTextColor: "#f5f5f5",
        headerTextWeight: "400",
        headerSubTextColor: "rgb(147, 147, 147)",
        headerSubFontWeight: "300",
        textColor: "#f5f5f5",
        textWeight: "400",
        hintInfoTextColor: "white",
        hintInfoTextWeight: "400",
    },
};

export const NodeConfigWindowStyle = createStyleStore(NodeConfigWindowStyleConfig);

//////////     N O D E     R O W     //////////

const NodeRowStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        hoverColor: "rgba(255, 255, 255, 0.09)",
        disabledBackgroundColor: "rgba(255, 255, 255, 0.22)",
        disabledHoverColor: "rgba(255, 255, 255, 0.28)",
        svgButtonsColor: "rgb(192, 192, 192)",
    },
};

export const NodeRowStyle = createStyleStore(NodeRowStyleConfig);

//////////     N O D E     I N P U T     F I E L D     //////////

const NodeInputFieldStyleConfig: ComponentStyles = {
    dark: {
        width: "90%",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#1a2027",
        borderColor: "#1a2027",
        disabledBackgroundColor: "#42505f",
        disabledBorderColor: "#42505f",
        selectedBackgroundColor: "#1a2027",
        selectedBorderColor: "#2F80ED",
        badFormatBackgroundColor: "#1a2027",
        badFormatBorderColor: "#e74c3c",
        paddingLeft: "10px",
        fontSize: "0.9rem",
        fontColor: "#f5f5f5",
        fontWeight: "400",
        textAlign: "center",
        infoTextColor: "#f5f5f5",
        infoTextSize: "0.9rem",
        infoTextWeight: "400",
        unitTextColor: "rgb(170,170,170)",
    },
};

export const NodeInputFieldStyle = createStyleStore(NodeInputFieldStyleConfig);

//////////     N O D E     S E L E C T O R     //////////

const NodeSelectorStyleConfig: ComponentStyles = {
    dark: {
        width: "90%",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#1a2027",
        borderColor: "#1a2027",
        disabledBackgroundColor: "#42505f",
        disabledBorderColor: "#42505f",
        selectedColor: "#14566b",
        badFormatBackgroundColor: "#1a2027",
        badFormatBorderColor: "#e74c3c",
        optionsBackgroundColor: "#1e242b",
        optionsBorderColor: "#323a45",
        optionsInnerBorderColor: "#323a45",
        optionHeight: "40px",
        fontSize: "0.9rem",
        letterSpacing: "normal",
        wordSpacing: "normal",
        arrowWidth: "16px",
        arrowHeight: "16px",
        arrowRightPos: "5px",
    },
};

export const NodeSelectorStyle = createStyleStore(NodeSelectorStyleConfig);
