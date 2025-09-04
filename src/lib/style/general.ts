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
        imageWidth: "32px",
        imageHeight: "32px",
    },
};

export const ActionStyle = createStyleStore(ActionStyleConfig);

//////////     T O A S T     //////////

const ToastStyleConfig: ComponentStyles = {
    dark: {
        alertBackgroundColor: "#a11f2a",
        alertBorderColor: "#b91c1c",
        warningBackgroundColor: "#f59e42",
        warningBorderColor: "#e67e22",
        infoBackgroundColor: "#1e3a8a",
        infoBorderColor: "#1d4ed8",
        neutralBackgroundColor: "#374151",
        neutralBorderColor: "#6b7280",
        textColor: "#ffffff",
    },
};

export const ToastStyle = createStyleStore(ToastStyleConfig);

//////////     C H E C K B O X     //////////

const CheckboxStyleConfig: ComponentStyles = {
    dark: {
        width: "1.5em",
        height: "1.5em",
        checkMarkWidth: 24,
        checkMarkHeight: 24,
        checkMarkStroke: 2.5,
        disabledBackgroundColor: "#42505f",
        disabledBorderColor: "#5a646e",
        enabledBackgroundColor: "#2f80ed",
        enabledBorderColor: "#5a646e",
        badFormatBackgroundColor: "#e74c3c",
        badFormatBorderColor: "#5a646e",
        disabledCheckMarkColor: "rgb(170,170,170)",
        enabledCheckMarkColor: "rgb(255,255,255)",
    },
};

export const CheckBoxStyle = createStyleStore(CheckboxStyleConfig);

//////////     E D I T A B L E     T E X T     //////////

const EditableTextStyleConfig: ComponentStyles = {
    dark: {
        width: "75%",
        fontSize: "1.1rem",
        fontColor: "#f5f5f5",
        borderColorBottom: "rgba(255, 255, 255, 0.2)",
        invalidBorderColorBottom: "#e74c3c",
        buttonImageWidth: "32px",
        buttonImageHeight: "32px",
    },
};

export const EditableTextStyle = createStyleStore(EditableTextStyleConfig);

//////////     E X P A N D A B L E     B U T T O N     //////////

const ExpandableButtonStyleConfig: ComponentStyles = {
    dark: {
        modalWidth: "250px",
        modalHeight: "fit-content",
        modalBackgroundColor: "#1e242b",
        modalBorderColor: "#2c343d",
        modalBorderRadius: "10px",
        openBackgroundColor: "rgba(255, 255, 255, 0.05)",
        openHoverBackgroundColor: "rgba(255, 255, 255, 0.1)",
        openStrokeColor: "#cccccc",
        openHoverStrokeColor: "#eeeeee",
        closeBackgroundColor: "rgba(255, 255, 255, 0.1)",
        closeHoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
        closeStrokeColor: "white",
        closeHoverStrokeColor: "#eeeeee",
        badFormatBackgroundColor: "rgba(255, 255, 255, 0.05)",
        badFormatHoverBackgroundColor: "rgba(255, 255, 255, 0.05)",
        badFormatStrokeColor: "#e74c3c",
        badFormatHoverStrokeColor: "#c0392b",
    },
};

export const ExpandableButtonStyle = createStyleStore(ExpandableButtonStyleConfig);

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
    },
};

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
    },
};

export const InputFieldStyle = createStyleStore(InputFieldStyleConfig);

//////////     D A N G E R     I N P U T     F I E L D     //////////

const DangerInputFieldStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#23272f",
        borderColor: "#323a45",
        disabledBackgroundColor: "#23272f",
        disabledBorderColor: "#323a45",
        selectedBackgroundColor: "#252b33",
        selectedBorderColor: "#e74c3c",
        badFormatBackgroundColor: "#252b33",
        badFormatBorderColor: "#e74c3c",
        paddingLeft: "10px",
        fontSize: "1rem",
        fontColor: "#f5f5f5",
        fontWeight: "400",
        textAlign: "center",
        infoTextColor: "rgb(170, 170, 170)",
        infoTextSize: "0.95rem",
        infoTextWeight: "400",
        unitTextColor: "rgb(170,170,170)",
    },
};

export const DangerInputFieldStyle = createStyleStore(DangerInputFieldStyleConfig);

//////////     L A N G U A G E     S E L E C T O R     //////////

const LangSelectorStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "#1e242b",
        borderColor: "#323a45",
        selectedColor: "#00796b",
        optionsBackgroundColor: "#1e242b",
        optionsBorderColor: "#323a45",
        selectedOptionTextColor: "#eeeeee",
        optionsTextColor: "#b0bec5",
        optionsSelectedTextColor: "#eeeeee",
    },
};

export const LangSelectorStyle = createStyleStore(LangSelectorStyleConfig);

//////////     M E N U     B U T T O N     //////////

const MenuButtonStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "transparent",
        hoverColor: "#323a45",
        hamburgerLinesColor: "white",
    },
};

export const MenuButtonStyle = createStyleStore(MenuButtonStyleConfig);

//////////     M O D A L     W I N D O W     //////////

const ModalWindowStyleConfig: ComponentStyles = {
    dark: {
        width: "80%",
        height: "fit-content",
        borderRadius: "10px",
        backgroundColor: "#14161c",
        borderColor: "#2a2e3a",
        titleSize: "1rem",
        titleColor: "#f5f5f5",
        titleWeight: "400",
    },
};

export const ModalWindowStyle = createStyleStore(ModalWindowStyleConfig);

//////////     N O T I F I C A T I O N     //////////

const NotificationStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        hoverColor: "#2A2E3A",
        borderColor: "#2a2e3a",
        imageWidth: "32px",
        imageHeight: "32px",
        numberBackgroundColor: "#e53935",
        numberTextColor: "#eee",
    },
};

export const NotificationStyle = createStyleStore(NotificationStyleConfig);

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
        arrowWidth: "24px",
        arrowHeight: "24px",
        arrowRightPos: "10px",
    },
};

export const SelectorStyle = createStyleStore(SelectorStyleConfig);

//////////     S E L E C T O R     B U T T O N     //////////

const SelectorButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "75px",
        height: "20px",
        knobWidth: "32px",
        knobHeight: "32px",
        borderRadius: "10px",
        backgroundColor: "#3a3a3a",
        selectedBackgroundColor: "#4a4a4a",
        knobBackgroundColor: "#e0e0e0",
        knobSelectedBackgroundColor: "#2f80ed",
    },
};

export const SelectorButtonStyle = createStyleStore(SelectorButtonStyleConfig);

//////////     U P L O A D     I M A G E     //////////

const UploadImageStyleConfig: ComponentStyles = {
    dark: {
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        imageWidth: "auto",
        imageHeight: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        hoverColor: "rgba(255, 255, 255, 0.13)",
    },
};

export const UploadImageStyle = createStyleStore(UploadImageStyleConfig);
