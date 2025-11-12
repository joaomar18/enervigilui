<script lang="ts">
    import { BaseGraphObject } from "$lib/logic/view/graph/base";
    import type { EnergyConsumptionMetrics, EnergyConsumptionLogPoint, ProcessedEnergyConsumptionLogPoint } from "$lib/types/nodes/logs";
    import { FormattedTimeStep } from "$lib/types/date";
    import { LogSpanPeriod } from "$lib/types/view/nodes";


    // Styles
    import { BaseGraphStyle, GraphActionStyle, GraphMetricStyle } from "$lib/style/graph";

    // Props
    export let data: Array<ProcessedEnergyConsumptionLogPoint> | undefined;
    export let timeStep: FormattedTimeStep | null | undefined;
    export let logSpanPeriod: LogSpanPeriod;
    export let fullScreen: boolean = false;
    export let showFullScreen: boolean = false; // Used externally on Full Screen Graph
    export let showDatePicker: boolean = false;
    export let goBackEnabled: boolean;
    export let selectedTimeSpan: LogSpanPeriod;
    export let initialDate: Date;
    export let endDate: Date;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let globalMetrics: EnergyConsumptionMetrics | undefined;
    export let activeEnergyUnit: string = "";
    export let reactiveEnergyUnit: string = ""; 
    export let activeEnergyDecimalPlaces: number | null = null;
    export let reactiveEnergyDecimalPlaces: number | null = null;
    export let powerFactorDecimalPlaces: number | null = null;

    // Variables
    let graphContainer: HTMLDivElement;
    let gridElement: HTMLDivElement | null = null;
    let graph: BaseGraphObject<EnergyConsumptionLogPoint> | null = null;
    let showDateRange: boolean = false;
    let loaderTimeout: number | null = null;
    let showLoader: boolean = false;
    let insideGraph: boolean = false;
    let graphCreated: boolean = false;
    let graphNoData: boolean = true;
    let logPoint: EnergyConsumptionLogPoint | null = null;
    let cursorPos: { x: number | undefined; y: number | undefined };
    let resizeObserver: ResizeObserver | null = null;
</script>
