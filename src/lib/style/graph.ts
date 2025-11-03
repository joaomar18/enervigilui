import type { ComponentStyles } from "./components";
import { createStyleStore } from "./components";

//////////     G R A P H     A C T I O N     //////////

const GraphActionStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#0d1117",
        borderColor: "#30363d",
        hoverColor: "#010203",
        imageWidth: "32px",
        imageHeight: "32px",
        showToolTipDelay: 300,
    },
};

export const GraphActionStyle = createStyleStore(GraphActionStyleConfig);

//////////     G R A P H     B U T T O N     //////////

const GraphButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        minWidth: "auto",
        maxWidth: "auto",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: "#0d1117",
        disabledBackgroundColor: "#0d1117",
        selectedBackgroundColor: "rgba(255, 255, 255, 0.08)",
        borderColor: "#30363d",
        disabledBorderColor: "#30363d",
        selectedBorderColor: "rgba(255, 255, 255, 0.2)",
        hoverColor: "#010203",
        disabledHoverColor: "#010203",
        selectedHoverColor: "rgba(255, 255, 255, 0.12)",
        fontColor: "#eee",
        disabledFontColor: "#eee",
        selectedFontColor: "#eee",
        fontSize: "14px",
        fontWeight: "400",
        imageWidth: "32px",
        imageHeight: "32px",
        imageRightPos: "auto",
        imageLeftPos: "auto",
        showToolTipDelay: 300,
    },
};

export const GraphButtonStyle = createStyleStore(GraphButtonStyleConfig);

//////////     G R A P H     P E R I O D     B U T T O N     //////////

const GraphPeriodButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        minWidth: "40px",
        maxWidth: "40px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#0d1117",
        disabledBackgroundColor: "#161b22",
        selectedBackgroundColor: "#0066ff",
        borderColor: "#30363d",
        disabledBorderColor: "#21262d",
        selectedBorderColor: "#30363d",
        hoverColor: "#010203",
        disabledHoverColor: "#070a0f",
        selectedHoverColor: "#0052cc",
        fontColor: "#f0f6fc",
        disabledFontColor: "#484f58",
        selectedFontColor: "#f0f6fc",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "32px",
        imageHeight: "32px",
        showToolTipDelay: 300,
    },
};

export const GraphPeriodButtonStyle = createStyleStore(GraphPeriodButtonStyleConfig);

//////////     C U S T O M     D A T E     B U T T O N     //////////

const CustomDateButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#0d1117",
        disabledBackgroundColor: "#161b22",
        selectedBackgroundColor: "#30363d",
        borderColor: "#30363d",
        disabledBorderColor: "#21262d",
        selectedBorderColor: "#484f58",
        hoverColor: "#010203",
        disabledHoverColor: "#070a0f",
        selectedHoverColor: "#21262d",
        fontColor: "#f0f6fc",
        disabledFontColor: "#484f58",
        selectedFontColor: "#f0f6fc",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "32px",
        imageHeight: "32px",
        showToolTipDelay: 300,
    },
};

export const CustomDateButtonStyle = createStyleStore(CustomDateButtonStyleConfig);

//////////     S E L E C T E D     C U S T O M     D A T E     B U T T O N     //////////

const SelectedCustomDateButtonStyleConfig: ComponentStyles = {
    dark: {
        width: "40px",
        height: "40px",
        borderRadius: "5px",
        backgroundColor: "#0066ff",
        disabledBackgroundColor: "#161b22",
        selectedBackgroundColor: "#0061e6",
        borderColor: "#30363d",
        disabledBorderColor: "#21262d",
        selectedBorderColor: "#30363d",
        hoverColor: "#0052cc",
        disabledHoverColor: "#070a0f",
        selectedHoverColor: "#004db3",
        fontColor: "#f0f6fc",
        disabledFontColor: "#484f58",
        selectedFontColor: "#f0f6fc",
        fontSize: "1rem",
        fontWeight: "400",
        imageWidth: "32px",
        imageHeight: "32px",
        showToolTipDelay: 300,
    },
};

export const SelectedCustomDateButtonStyle = createStyleStore(SelectedCustomDateButtonStyleConfig);

//////////     B A S E     G R A P H     //////////

const BaseGraphStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "fit-content",
        minHeight: "auto",
        headerHeight: "fit-content",
        headerButtonsGap: "20px",
        xAxisHeight: "50px",
        yAxisWidth: "50px",
        unitDivWidth: "20px",
        unitMaxWidth: "100px",
        yAxisTickSpacingPx: 40,
        borderRadius: "10px",
        paddingHorizontal: "5px",
        paddingTop: "15px",
        paddingBottom: "0px",
        backgroundColor: "rgba(20, 22, 28, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        graphHeight: "450px",
        graphPaddingTop: "10px",
        graphPaddingLeft: "20px",
        graphPaddingRight: "20px",
        graphPaddingBottom: "0px",
        graphPeriodWidthPx: 70,
        graphPeriodWidthMaxPx: 70,
        graphGridWidthPx: 1,
        graphGridLineColor: "rgba(255, 255, 255, 0.06)",
        graphTextColor: "rgba(255, 255, 255, 0.9)",
        graphTextWeight: "500",
        subTextColor: "rgba(255, 255, 255, 0.5)",
        subTextWeight: "400",
        scrollbarTrackColor: "#323a45",
        scrollbarThumbColor: "#1e242b",
        loaderBackgroundBlur: "blur(8px)",
    },
};

export const BaseGraphStyle = createStyleStore(BaseGraphStyleConfig);

//////////     F U L L     S C R E E N     B A S E     G R A P H     //////////

const FullScreenBaseGraphStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "100%",
        minHeight: "600px",
        headerHeight: "fit-content",
        headerButtonsGap: "20px",
        xAxisHeight: "50px",
        yAxisWidth: "50px",
        unitDivWidth: "20px",
        unitMaxWidth: "100px",
        yAxisTickSpacingPx: 40,
        borderRadius: "10px",
        paddingHorizontal: "10px",
        paddingTop: "15px",
        paddingBottom: "15px",
        backgroundColor: "rgba(20, 22, 28, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.15)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        graphHeight: "100%",
        graphPaddingTop: "10px",
        graphPaddingLeft: "20px",
        graphPaddingRight: "20px",
        graphPaddingBottom: "0px",
        graphPeriodWidthPx: 100,
        graphPeriodWidthMaxPx: 100,
        graphGridWidthPx: 1,
        graphGridLineColor: "rgba(255, 255, 255, 0.06)",
        graphTextColor: "rgba(255, 255, 255, 0.9)",
        graphTextWeight: "500",
        subTextColor: "rgba(255, 255, 255, 0.5)",
        subTextWeight: "400",
        scrollbarTrackColor: "#323a45",
        scrollbarThumbColor: "#1e242b",
        loaderBackgroundBlur: "blur(8px)",
    },
};

export const FullScreenBaseGraphStyle = createStyleStore(FullScreenBaseGraphStyleConfig);

//////////     M E A S U R E M E N T     G R A P H     //////////

const MeasurementGraphStyleConfig: ComponentStyles = {
    dark: {
        lineWidthPx: 1.5,
        lineColor: "rgba(74, 144, 226, 0.85)",
        bandColor: "rgba(74, 144, 226, 0.15)",
        bandBorderWidthPx: 1,
        bandBorderColor: "transparent",
        lineHoverColor: "rgba(74, 144, 226, 1.0)",
        bandHoverColor: "rgba(74, 144, 226, 0.25)",
        bandBorderHoverColor: "rgba(74, 144, 226, 0.3)",
    },
};

export const MeasurementGraphStyle = createStyleStore(MeasurementGraphStyleConfig);

//////////     C O U N T E R     G R A P H     //////////

const CounterGraphStyleConfig: ComponentStyles = {
    dark: {
        barColor: "rgba(74, 144, 226, 0.15)",
        barBorderWidthPx: 1,
        barBorderColor: "transparent",
        barHoverColor: "rgba(74, 144, 226, 0.25)",
        barBorderHoverColor: "rgba(74, 144, 226, 0.3)",
    },
};

export const CounterGraphStyle = createStyleStore(CounterGraphStyleConfig);

//////////     G R A P H     M E T R I C     //////////

const GraphMetricStyleConfig: ComponentStyles = {
    dark: {
        forceCollapse: "TRUE",
        iconSize: "26px",
        textSize: "14px",
        rowWidth: "300px",
        rowPaddingLeft: "30px",
        rowPaddingRight: "30px",
        rowBorderRight: "1px solid rgba(255, 255, 255, 0.12)",
        labelWidth: "75px",
        labelPaddingLeft: "5px",
        labelColor: "rgba(255, 255, 255, 0.55)",
        labelWeight: "400",
        valueRightPadding: "5px",
        valueColor: "rgba(255, 255, 255, 0.95)",
        valueWeight: "500",
        unitMaxWidth: "50px",
        unitColor: "rgba(255, 255, 255, 0.55)",
        unitWeight: "400",
        noDataLabelColor: "rgba(255, 255, 255, 0.4)",
        noDataLabelWeight: "400",
    },
};

export const GraphMetricStyle = createStyleStore(GraphMetricStyleConfig);

//////////     F U L L     S C R E E N     G R A P H     M E T R I C     //////////

const FullScreenGraphMetricStyleConfig: ComponentStyles = {
    dark: {
        forceCollapse: "FALSE",
        iconSize: "32px",
        textSize: "1rem",
        rowWidth: "350px",
        rowPaddingLeft: "30px",
        rowPaddingRight: "30px",
        rowBorderRight: "1px solid rgba(255, 255, 255, 0.12)",
        labelWidth: "75px",
        labelPaddingLeft: "10px",
        labelColor: "rgba(255, 255, 255, 0.55)",
        labelWeight: "400",
        valueRightPadding: "5px",
        valueColor: "rgba(255, 255, 255, 0.95)",
        valueWeight: "500",
        unitMaxWidth: "50px",
        unitColor: "rgba(255, 255, 255, 0.55)",
        unitWeight: "400",
        noDataLabelColor: "rgba(255, 255, 255, 0.4)",
        noDataLabelWeight: "400",
    },
};

export const FullScreenGraphMetricStyle = createStyleStore(FullScreenGraphMetricStyleConfig);

//////////     G R A P H     P E R I O D     S E L E C T I O N     T O O L     T I P     //////////

const GraphPerSelStyleConfig: ComponentStyles = {
    dark: {
        width: "fit-content",
        minWidth: "auto",
        maxWidth: "auto",
        height: "fit-content",
        minHeight: "auto",
        maxHeight: "300px",
        offsetPx: "10px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        backgroundColor: "#1a1e24",
        paddingHorizontal: "10px",
        paddingVertical: "10px",
        animationTime: 200,
    },
};

export const GraphPerSelStyle = createStyleStore(GraphPerSelStyleConfig);

//////////     G R A P H     T O O L     T I P     //////////

const GraphToolTipStyleConfig: ComponentStyles = {
    dark: {
        width: "150px",
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
    },
};

export const GraphToolTipStyle = createStyleStore(GraphToolTipStyleConfig);

//////////     G R A P H     D A T A     T O O L     T I P     //////////

const GraphDataToolTipStyleConfig: ComponentStyles = {
    dark: {
        rowGap: "4px",
        textSize: "13px",
        labelWidth: "30px",
        labelColor: "rgba(255, 255, 255, 0.7)",
        labelWeight: "400",
        valueRightPadding: "5px",
        valueColor: "rgba(255, 255, 255, 0.95)",
        valueWeight: "500",
        unitMaxWidth: "35px",
        unitColor: "rgba(255, 255, 255, 0.6)",
        unitWeight: "400",
        noDataLabelColor: "rgba(255, 255, 255, 0.5)",
        noDataLabelWeight: "400",
    },
};

export const GraphDataToolTipStyle = createStyleStore(GraphDataToolTipStyleConfig);