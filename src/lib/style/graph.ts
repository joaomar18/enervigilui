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

//////////     B A S E     G R A P H     //////////

const BaseGraphStyleConfig: ComponentStyles = {
    dark: {
        width: "100%",
        height: "100%",
        headerHeight: "fit-content",
        headerButtonsGap: "20px",
        xAxisHeight: "50px",
        yAxisWidth: "50px",
        unitDivWidth: "20px",
        unitMaxWidth: "100px",
        yAxisTickSpacingPx: 40,
        borderRadius: "10px",
        paddingHorizontal: "15px",
        paddingTop: "15px",
        paddingBottom: "0px",
        backgroundColor: "rgba(20, 22, 28, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        graphPaddingTop: "0px",
        graphPaddingLeft: "20px",
        graphPaddingRight: "20px",
        graphPaddingBottom: "0px",
        graphPeriodWidthPx: 70,
        graphGridWidthPx: 1,
        graphGridLineColor: "rgba(255, 255, 255, 0.06)",
        graphAverageLineWidthPx: 1.5,
        graphAverageLineColor: "rgba(74, 144, 226, 0.85)",
        graphTextColor: "rgba(255, 255, 255, 0.9)",
        graphTextWeight: "500",
        subTextColor: "rgba(255, 255, 255, 0.5)",
        subTextWeight: "400",
        scrollbarTrackColor: "#323a45",
        scrollbarThumbColor: "#1e242b",
    },
};

export const BaseGraphStyle = createStyleStore(BaseGraphStyleConfig);


//////////     M E A S U R E M E N T     G R A P H     //////////

const MeasurementGraphStyleConfig: ComponentStyles = {
    dark: {
        
    },
};

export const MeasurementGraphStyle = createStyleStore(MeasurementGraphStyleConfig);

