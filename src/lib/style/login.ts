import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     H E A D E R     //////////

const HeaderStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "#1a1f26",
        dropdownBackgroundColor: "#252b33",
        dropdownBorderBottomColor: "#37404a",
        textColor: "#eeeeee",
    },
};

export const HeaderStyle = createStyleStore(HeaderStyleConfig);

//////////     L O G I N     F O R M     //////////

const LoginFormStyleConfig: ComponentStyles = {
    dark: {
        backgroundColor: "#212830",
        titleColor: "rgb(255,255,255)",
        textColor: "#eeeeee",
        titleWeight: "400",
        textWeight: "300",
    },
};

export const LoginFormStyle = createStyleStore(LoginFormStyleConfig);

//////////     F O R G O T     P A S S W O R D     B U T T O N     //////////

const ForgotPassButtonStyleConfig: ComponentStyles = {
    dark: {
        paddingTop: "20px",
        paddingBottom: "30px",
        textColor: "rgb(216,216,216)",
        hoverTextColor: "rgb(51,151,210)",
    },
};

export const ForgotPassButtonStyle = createStyleStore(ForgotPassButtonStyleConfig);

//////////     L O G I N     F I E L D     //////////

const LoginFieldStyleConfig: ComponentStyles = {
    dark: {
        paddingTop: "0px",
        paddingBottom: "0px",
        imageWidth: "28px",
        imageHeight: "28px",
        labelTextColor: "rgb(255,255,255)",
    },
};

export const LoginFieldStyle = createStyleStore(LoginFieldStyleConfig);

//////////     L O G I N     H I N T     I N F O     //////////

const LoginHintInfoStyleConfig: ComponentStyles = {
    dark: {
        hintWidth: "300px",
        hintHeight: "fit-content",
        textColor: "#d72638",
        hintBackgroundColor: "#1e242b",
        hintBorderColor: "#2c343d",
        hintBorderRadius: "10px",
        openBackgroundColor: "rgba(215, 38, 56, 0.2)",
        openHoverBackgroundColor: "rgba(255, 255, 255, 0.1)",
        openStrokeColor: "#d72638",
        openHoverStrokeColor: "#ff3e50",
        closeBackgroundColor: "rgba(255, 255, 255, 0.1)",
        closeHoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
        closeStrokeColor: "white",
        closeHoverStrokeColor: "#eeeeee",
    },
};

export const LoginHintInfoStyle = createStyleStore(LoginHintInfoStyleConfig);

//////////     L O G I N     B U T T O N     //////////

const LoginButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "200px",
        height: "55px",
        paddingTop: "0px",
        paddingBottom: "0px",
        backgroundColor: "rgb(0, 158, 96)",
        processingBackgroundColor: "rgb(127,127,127)",
        hoverColor: "rgb(0, 143, 57)",
        textColor: "rgb(255,255,255)",
        loaderWidth: "24",
        loaderHeight: "24",
        loaderColor: "rgb(255,255,255)",
    },
};

export const LoginButtonStyle = createStyleStore(LoginButtonStyleConfig);

//////////     I N F O     //////////

const InfoStyleConfig: ComponentStyles = {
    dark: {
        paddingTop: "0px",
        paddingBottom: "0px",
        appImageBackgroundColor: "#1a1f26",
        appImageShadowColor: "rgba(0, 0, 0, 0.2)",
        mainTextColor: "#eeee",
        subTextColor: "#eeee",
        mainTextWeight: "500",
        subTextWeight: "300",
    },
};

export const InfoStyle = createStyleStore(InfoStyleConfig);

//////////     L I N K     //////////

const LinkStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
        height: "40px",
        paddingLeft: "10px",
        paddingRight: "0px",
        imageWidth: "32px",
        imageHeight: "32px",
        imageRightPosition: "10px",
        fontSize: "1rem",
        fontColor: "#eeeeee",
        backgroundColor: "#252b33",
        hoverColor: "#323a45",
        borderBottomColor: "transparent",
    },
};

export const LinkStyle = createStyleStore(LinkStyleConfig);

//////////     M O B I L E     L I N K     //////////

const MobileLinkStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "74px",
        paddingLeft: "20px",
        paddingRight: "20px",
        imageWidth: "46px",
        imageHeight: "46px",
        imageRightPosition: "20px",
        fontSize: "20px",
        fontColor: "#eeeeee",
        backgroundColor: "#1f262d",
        hoverColor: "#2c343d",
        borderBottomColor: "#2c343d",
    },
};

export const MobileLinkStyle = createStyleStore(MobileLinkStyleConfig);
