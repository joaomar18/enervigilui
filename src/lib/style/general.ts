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
        showToolTipDelay: 300,
    },
};

export const ActionStyle = createStyleStore(ActionStyleConfig);

//////////     S L O T T E D     A C T I O N     //////////

const SlottedActionStyleConfig: ComponentStyles = {
    dark: {
        width: "fit-content",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        borderColor: "#2a2e3a",
        hoverColor: "#2a2e3a",
        showToolTipDelay: 300,
    },
};

export const SlottedActionStyle = createStyleStore(SlottedActionStyleConfig);

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
        showToolTipDelay: 300,
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

//////////     C I R C U L A R     L O A D E R     //////////

const CircularLoaderStyleConfig: ComponentStyles = {
    dark: {
        width: "64px",
        height: "64px",
        loaderTopPos: "0px",
        wrapperTopPos: "0px",
        wrapperBackgroundColor: "rgba(20, 22, 28, 0.8)",
        wrapperOpacity: "1",
        wrapperTopLeftRadius: "0px",
        wrapperTopRightRadius: "0px",
        wrapperBottomLeftRadius: "20px",
        wrapperBottomRightRadius: "20px",
        border: "4px solid rgba(255, 255, 255, 0.2)",
        loaderColor: "#fff",
    },
};

export const CircularLoaderStyle = createStyleStore(CircularLoaderStyleConfig);

//////////     C I R C U L A R     L O A D E R     F U L L     S C R E E N     //////////

const CircularLoaderFullScreenStyleConfig: ComponentStyles = {
    dark: {
        width: "128px",
        height: "128px",
        wrapperTopPos: "-104px",
        border: "4px solid rgba(255, 255, 255, 0.2)",
        loaderColor: "#fff",
    },
};

export const CircularLoaderFullScreenStyle = createStyleStore(CircularLoaderFullScreenStyleConfig);

//////////     C O N T E N T     C A R D     //////////

const ContentCardStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "100%",
        minHeight: "auto",
        maxHeight: "auto",
        backgroundColor: "#14161c",
        borderColor: "rgba(255,255,255,0.07)",
        shadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
        titleSize: "1.0625rem",
        titleColor: "#f5f5f5",
        titleWeight: "500",
        titlePaddingLeft: "10px",
        headerWidth: "calc(100% - 40px)",
        headerHeight: "32px",
        headerBorder: "1px solid rgba(255,255,255,0.1)",
        headerPaddingTop: "10px",
        headerPaddingBottom: "10px",
        contentPaddingTop: "10px",
        contentPaddingBottom: "30px",
        contentPaddingHorizontal: "20px",
        scrollbarTrackColor: "#1a1c22",
        scrollbarThumbColor: "#4a5059",
    },
};

export const ContentCardStyle = createStyleStore(ContentCardStyleConfig);

//////////     R I G H T     P A N E L     S H E E T     //////////

const RightPanelSheetStyleConfig: ComponentStyles = {
    dark: {
        maskBlurFilter: "8px",
        maskBackground: "rgba(24, 29, 35, 0.25)",
        width: "100vw",
        minWidth: "350px",
        maxWidth: "420px",
        paddingTop: "5px",
        paddingBottom: "10px",
        paddingHorizontal: "10px",
        backgroundColor: "#1c2026",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        shadow: "-4px 0 12px rgba(0, 0, 0, 0.6)",
        titlePaddingLeft: "0px",
        titlePaddingRight: "20px",
        titlePaddingBottom: "5px",
        borderBottomTitle: "1px solid rgba(255, 255, 255, 0.1)",
        headerPaddingHorizontal: "20px",
        headerPaddingTop: "15px",
        headerPaddingBottom: "15px",
        borderBottomHeader: "1px solid rgba(255, 255, 255, 0.08)",
        closeButtonWidth: "40px",
        closeButtonHeight: "40px",
        closeButtonImageWidth: 32,
        closeButtonImageHeight: 32,
        closeButtonColor: "rgba(255, 255, 255, 0.7)",
        closeButtonHoverColor: "rgba(255, 255, 255, 0.9)",
        contentMarginTop: "20px",
        contentMarginBottom: "0px",
        contentPaddingHorizontal: "0px",
        scrollbarTrackColor: "#323a45",
        scrollbarThumbColor: "#1e242b",
    },
};

export const RightPanelSheetStyle = createStyleStore(RightPanelSheetStyleConfig);

//////////     E X P A N D A B L E     S E C T I O N     //////////

const ExpandableSectionStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        paddingTop: "5px",
        paddingBottom: "5px",
        headerHeight: "fit-content",
        headerBorderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        headerPaddingBottom: "5px",
        contentPaddingTop: "10px",
        titleSize: "13px",
        titleColor: "#9CA3AF",
        titleWeight: "400",
        titleSpacing: "0.5px",
        titleTextTransform: "uppercase",
        titleMarginLeft: "10px",
        expandButtonWidth: "40px",
        expandButtonHeight: "40px",
        expandButtonHoverColor: "#1c1f26",
        expandButtonMarginRight: "0px",
        expandButtonArrowWidth: "24px",
        expandButtonArrowHeight: "24px",
    },
};

export const ExpandableSectionStyle = createStyleStore(ExpandableSectionStyleConfig);

//////////     B A R     //////////

const BarStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1f2937",
        border: "1px solid #374151",
        borderRadius: "0px",
        fillWidth: "100%",
        fillHeight: "100%",
        fillColor: "#10b981",
        fillMinAlarmColor: "#ef4444",
        fillMaxAlarmColor: "#ef4444",
        fillMinWarningColor: "#f59e0b",
        fillMaxWarningColor: "#f59e0b",
        arrowWidth: "5px",
        arrowHeight: "6px",
        arrowColor: "#9ca3af",
        arrowMinAlarmColor: "#ef4444",
        arrowMaxAlarmColor: "#ef4444",
        arrowMinWarningColor: "#f59e0b",
        arrowMaxWarningColor: "#f59e0b",
    },
};

export const BarStyle = createStyleStore(BarStyleConfig);

//////////     I N L I N E     L O A D E R     //////////

const InlineLoaderStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        border: "none",
        shadow: "none",
        waveBackground: "linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)",
        waveAnimationTime: "1.6s",
    },
};

export const InlineLoaderStyle = createStyleStore(InlineLoaderStyleConfig);

//////////     T O O L     T I P     //////////

const ToolTipStyleConfig: ComponentStyles = {
    dark: {
        width: "fit-content",
        minWidth: "auto",
        maxWidth: "300px",
        height: "fit-content",
        minHeight: "auto",
        maxHeight: "300px",
        offsetPx: "10px",
        border: "1px solid #3a4149",
        borderRadius: "10px",
        backgroundColor: "#0a0c0f",
        paddingHorizontal: "10px",
        paddingVertical: "10px",
        animationTime: 200,
    },
};

export const ToolTipStyle = createStyleStore(ToolTipStyleConfig);

//////////     T E X T     C O L O R S     //////////

const ToolTipTexStyleConfig: ComponentStyles = {
    dark: {
        textColor: "#eeee",
        textWeight: "300",
        textSize: "14px",
    }
}

export const ToolTipTextStyle = createStyleStore(ToolTipTexStyleConfig);