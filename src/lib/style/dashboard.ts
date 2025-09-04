import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     L E F T     P A N E L     //////////

const LeftPanelStyleConfig: ComponentStyles = {
    dark: {
        overlayMaskBackgroundColor: "rgba(0, 0, 0, 0.3)",
        backgroundColor: "#15191f",
        borderRightColor: "rgba(255, 255, 255, 0.02)",
        scrollbarTrackColor: "#323a45",
        scrollbarThumbColor: "#1e242b",
        sectionTextColor: "rgba(255, 255, 255, 0.4)",
        sectionTextWeight: "500",
        sectionBorderBottomColor: "rgba(255, 255, 255, 0.1)",
        textColor: "#eeeeee",
        textWeight: "300",
    },
};

export const LeftPanelStyle = createStyleStore(LeftPanelStyleConfig);

//////////     L I N K     //////////

const LinkStyleConfig: ComponentStyles = {
    dark: {
        height: "48px",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingLeftText: "10px",
        imageWidth: "25px",
        imageHeight: "25px",
        arrowImageWidth: "16px",
        arrowImageHeight: "16px",
        fontSize: "1rem",
        textColor: "#eeeeee",
        backgroundColor: "transparent",
        hoverColor: "rgba(255, 255, 255, 0.05)",
        selectedColor: "#2F4138",
        selectedHoverColor: "rgba(47, 65, 56, 0.8)",
        arrowBackgroundColor: "transparent",
        arrowHoverColor: "rgba(255, 255, 255, 0.05)",
        arrowSelectedColor: "#2F4138",
        arrowSelectedHoverColor: "rgba(47, 65, 56, 0.8)",
        arrowLeftBorderColor: "rgba(255, 255, 255, 0.2)",
        borderBottomColor: "transparent",
        subContentBorderColor: "rgba(255, 255, 255, 0.2)",
    },
};

export const LinkStyle = createStyleStore(LinkStyleConfig);

//////////     S U B     L I N K     //////////

const SubLinkStyleConfig: ComponentStyles = {
    dark: {
        height: "36px",
        paddingLeft: "20px",
        paddingRight: "8px",
        paddingLeftText: "8px",
        imageWidth: "18px",
        imageHeight: "18px",
        arrowImageWidth: "12px",
        arrowImageHeight: "12px",
        fontSize: "0.875rem",
        textColor: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "transparent",
        hoverColor: "rgba(255, 255, 255, 0.03)",
        selectedColor: "rgba(255, 255, 255, 0.08)",
        selectedHoverColor: "rgba(255, 255, 255, 0.12)",
        arrowBackgroundColor: "transparent",
        arrowHoverColor: "rgba(255, 255, 255, 0.04)",
        arrowSelectedColor: "rgba(255, 255, 255, 0.06)",
        arrowSelectedHoverColor: "rgba(255, 255, 255, 0.1)",
        arrowLeftBorderColor: "rgba(255, 255, 255, 0.1)",
        borderBottomColor: "transparent",
        subContentBorderColor: "rgba(255, 255, 255, 0.08)",
    },
};

export const SubLinkStyle = createStyleStore(SubLinkStyleConfig);

//////////     L O G O U T     //////////

const LogoutStyleConfig: ComponentStyles = {
    dark: {
        width: "125px",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        hoverColor: "#2a2e3a",
        borderColor: "#2a2e3a",
        fontSize: "1rem",
        paddingLeft: "10px",
        paddingRight: "20px",
        paddingLeftText: "0px",
        imageWidth: "32px",
        imageHeight: "32px",
        textColor: "#eeeeee",
        textWeight: "400",
    },
};

export const LogoutStyle = createStyleStore(LogoutStyleConfig);

//////////     S E A R C H     B A R     //////////

const SearchBarStyleConfig: ComponentStyles = {
    dark: {
        width: "80%",
        height: "40px",
        borderRadius: "20px",
        searchButtonWidth: "75px",
        backgroundColor: "#14161c",
        buttonBgColor: "#1C2126",
        buttonHoverColor: "#232731",
        borderColor: "#2a2e3a",
        buttonBorderColor: "#2a2e3a",
        selectedBorderColor: "#3B7DFF",
        imageWidth: "25px",
        imageHeight: "25px",
        textColor: "#eee",
    },
};

export const SearchBarStyle = createStyleStore(SearchBarStyleConfig);
