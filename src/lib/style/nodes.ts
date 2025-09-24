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
        arrowWidth: "20x",
        arrowHeight: "20px",
        arrowRightPos: "4px",
    },
};

export const NodeSelectorStyle = createStyleStore(NodeSelectorStyleConfig);

//////////     N O D E     C O N F I G U R A T I O N     P O P U P     S E L E C T O R     //////////

const NodeConfigPopupSelectorStyleConfig: ComponentStyles = {
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
        arrowWidth: "24x",
        arrowHeight: "24px",
        arrowRightPos: "10px",
    },
};

export const NodeConfigPopupSelectorStyle = createStyleStore(NodeConfigPopupSelectorStyleConfig);

//////////     N O D E S     G R I D     //////////

const NodesGridStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "fit-content",
        borderRadius: "10px",
        backgroundColor: "#252b33",
        borderColor: "#323a45",
        headerBackgroundColor: "#1A2128",
        headerTextColor: "#f5f5f5",
        subSectionBackgroundColor: "#1f2a31",
        subSectionTextColor: "#cbd5e1",
        subSectionBorderColor: "transparent",
    },
};

export const NodesGridStyle = createStyleStore(NodesGridStyleConfig);

//////////     N O D E S     B A S E     D I S P L A Y     //////////

const NodesBaseDisplayStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        paddingHorizontal: "0px",
        paddingVertical: "10px",
        labelPaddingTop: "0px",
        labelPaddingBottom: "8px",
        labelPaddingRight: "20px",
        labelSize: "1rem",
        labelColor: "#D4D4D8",
        labelWeight: "500",
        displayHeight: "40px",
        displayWidth: "100%",
        displayMaxWidth: "300px",
        displayBorder: "1px solid #52525B",
        displayHoverBorder: "1px solid #6B7280",
        displayDisconnectedBorder: "1px solid #52525B",
        displayDisconnectedHoverBorder: "1px solid #6B7280",
        displayBackgroundColor: "rgba(82, 82, 91, 0.1)",
        displayHoverBackgroundColor: "rgba(82, 82, 91, 0.18)",
        displayDisconnectedBackgroundColor: "rgba(107, 114, 128, 0.15)",
        displayDisconnectedHoverBackgroundColor: "rgba(107, 114, 128, 0.22)",
        displayHoverShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
        displayDisconnectedHoverShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        displayRadius: "20px",
        displayPaddingHorizontal: "20px",
        alertsDivItemGap: "10px",
        stateCircleDiameter: "10px",
        stateCircleAlarmColor: "#ef4444",
        stateCircleAlarmHoverColor: "#ef4444",
        stateCircleAlarmHoverShadow: "0 0 3px rgba(239, 68, 68, 0.4)",
        stateCircleWarningColor: "#f59e0b",
        stateCircleWarningHoverColor: "#f59e0b",
        stateCircleWarningHoverShadow: "0 0 3px rgba(245, 158, 11, 0.4)",
        disconnectedImageWidth: "25px",
        disconnectedImageHeight: "25px",
        animationDuration: "0.2s",
    },
};

export const NodesBaseDisplayStyle = createStyleStore(NodesBaseDisplayStyleConfig);

//////////     M E A S U R E M E N T     D I S P L A Y     //////////

const MeasurementDisplayStyleConfig: ComponentStyles = {
    dark: {
        valueTextSize: "1.0625rem",
        valueTextColor: "#E4E4E7",
        valueTextSpacing: "0.25px",
        valueTextWeight: "600",
        valueTextPaddingRight: "20px",
        unitTextSize: "1.0625rem",
        unitTextColor: "#A1A1AA",
        unitTextWeight: "400",
        unitTextPaddingLeft: "20px",
        barWidth: "100%",
        barHeight: "3px",
    },
};

export const MeasurementDisplayStyle = createStyleStore(MeasurementDisplayStyleConfig);

//////////     T E X T     D I S P L A Y     //////////

const TextDisplayStyleConfig: ComponentStyles = {
    dark: {
        valueTextSize: "1.0625rem",
        valueTextColor: "#E4E4E7",
        valueTextSpacing: "0.25px",
        valueTextWeight: "600",
        valueTextPaddingRight: "20px",
    },
};

export const TextDisplayStyle = createStyleStore(TextDisplayStyleConfig);

//////////     C O U N T E R     D I S P L A Y     //////////

const CounterDisplayStyleConfig: ComponentStyles = {
    dark: {
        valueTextSize: "1.0625rem",
        valueTextColor: "#E4E4E7",
        valueTextSpacing: "0.25px",
        valueTextWeight: "600",
        valueTextPaddingRight: "20px",
        unitTextSize: "1.0625rem",
        unitTextColor: "#A1A1AA",
        unitTextWeight: "400",
        unitTextPaddingLeft: "20px",
        barWidth: "100%",
        barHeight: "3px",
    },
};

export const CounterDisplayStyle = createStyleStore(CounterDisplayStyleConfig);
