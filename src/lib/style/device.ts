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
