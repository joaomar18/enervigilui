import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     A D D     D E V I C E     //////////

const AddDeviceStyleConfig: ComponentStyles = {
    dark: {
        width: "300px",
        height: "400px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        borderColor: "rgba(255,255,255,0.07)",
        imageBackgroundColor: "rgba(255, 255, 255, 0.1)",
        imageContainerWidth: "200px",
        imageContainerHeight: "200px",
        imageContainerBorderRadius: "50%",
        imageWidth: "auto",
        imageHeight: "100%",
        strokeColor: "#9E9E9E",
        strokeSelectedColor: "#e0e0e0",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        titleColor: "#f5f5f5",
    },
};

export const AddDeviceStyle = createStyleStore(AddDeviceStyleConfig);

//////////     D E V I C E     C A R D     //////////

const DeviceCardStyleConfig: ComponentStyles = {
    dark: {
        width: "300px",
        height: "400px",
        borderRadius: "20px",
        backgroundColor: "#14161c",
        borderColor: "rgba(255,255,255,0.07)",
        imageBackgroundColor: "rgba(255, 255, 255, 0.1)",
        imageContainerWidth: "200px",
        imageContainerHeight: "200px",
        imageContainerBorderRadius: "50%",
        imageWidth: "auto",
        imageHeight: "100%",
        textColor: "#e0e0e0",
        imageHoverBackgroundColor: "rgba(50, 50, 50, 0.4)",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        titleColor: "#f5f5f5",
    },
};

export const DeviceCardStyle = createStyleStore(DeviceCardStyleConfig);

//////////     D E V I C E     R E A L     T I M E     C A R D     //////////

const DeviceRealTimeCardStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "clamp(400px, 40vh, 680px)",
        minHeight: "400px",
        maxHeight: "680px",
        backgroundColor: "#14161c",
        borderColor: "rgba(255,255,255,0.07)",
        shadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
        titleColor: "#f5f5f5",
        titleWeight: "300",
        titlePaddingLeft: "10px",
        headerWidth: "calc(100% - 40px)",
        headerBorder: "1px solid rgba(255,255,255,0.1)",
        headerPaddingTop: "20px",
        headerPaddingBottom: "10px",
        contentPaddingTop: "20px",
        contentPaddingBottom: "30px",
        contentPaddingHorizontal: "20px",
        scrollbarTrackColor: "#1a1c22",
        scrollbarThumbColor: "#4a5059",
    },
};

export const DeviceRealTimeCardStyle = createStyleStore(DeviceRealTimeCardStyleConfig);

//////////     D E V I C E     I N F O     H E A D E R     //////////

const DeviceInfoHeaderStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        maxWidth: "375px",
        mainTextWidth: "200px",
        mainTextColor: "#c9c9c9",
        mainTextWeight: "300",
        subTextColor: "#9a9a9a",
        subTextWeight: "300",
        imageWidth: "40px",
        imageHeight: "40px",
        imageBackgroundColor: "rgba(255, 255, 255, 0.1)",
        imageBorderRadius: "50%",
    },
};

export const DeviceInfoHeaderStyle = createStyleStore(DeviceInfoHeaderStyleConfig);

//////////     M O B I L E     D E V I C E     I N F O     H E A D E R     //////////

const MobileDeviceInfoHeaderStyleConfig: ComponentStyles = {
    dark: {
        mainTextColor: "#c9c9c9",
        mainTextWeight: "300",
        subTextColor: "#9a9a9a",
        subTextWeight: "300",
        imageWidth: "32px",
        imageHeight: "32px",
        arrowWidth: "24px",
        arrowHeight: "24px",
    },
};

export const MobileDeviceInfoHeaderStyle = createStyleStore(MobileDeviceInfoHeaderStyleConfig);

//////////     D E V I C E     A C T I O N     //////////

const DeviceActionStyleConfig: ComponentStyles = {
    dark: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "transparent",
        hoverColor: "rgba(255, 255, 255, 0.2)",
        imageWidth: "32px",
        imageHeight: "32px",
    },
};

export const DeviceActionStyle = createStyleStore(DeviceActionStyleConfig);

//////////     D E V I C E     N O T I F I C A T I O N     //////////

const DeviceNotificationStyleConfig: ComponentStyles = {
    dark: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        hoverColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "transparent",
        imageWidth: "32px",
        imageHeight: "32px",
        numberBackgroundColor: "#e53935",
        numberTextColor: "#eee",
    },
};

export const DeviceNotificationStyle = createStyleStore(DeviceNotificationStyleConfig);

//////////     D E V I C E     R E A L     T I M E     C A R D     A C T I O N     //////////

const RealTimeCardActionStyleConfig: ComponentStyles = {
    dark: {
        width: "32px",
        height: "32px",
        borderRadius: "16px",
        backgroundColor: "#1b1e26",
        borderColor: "#3b4250",
        hoverColor: "#3b4250",
        imageWidth: "20px",
        imageHeight: "20px",
    },
};

export const RealTimeCardActionStyle = createStyleStore(RealTimeCardActionStyleConfig);