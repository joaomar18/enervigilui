import { NodeCategory } from "../nodes/base";
import type { SvelteComponent } from "svelte";
import Measurement from "../../../components/Devices/Nodes/RealTimeDisplay/Measurement.svelte";
import Counter from "../../../components/Devices/Nodes/RealTimeDisplay/Counter.svelte";
import Text from "../../../components/Devices/Nodes/RealTimeDisplay/Text.svelte";
import CounterGraph from "../../../components/Devices/Nodes/Graphs/CounterGraph.svelte";
import CounterMetrics from "../../../components/Devices/Nodes/Metrics/CounterMetrics.svelte";
import MeasurementGraph from "../../../components/Devices/Nodes/Graphs/MeasurementGraph.svelte";
import MeasurementMetrics from "../../../components/Devices/Nodes/Metrics/MeasurementMetrics.svelte";

/** Configuration for which real-time card categories are active/visible */
export type RealTimeCardCategoriesState = Record<NodeCategory, boolean>;

/** Default state with all real-time card categories disabled */
export const defaultRealTimeCardCategoriesState = {
    [NodeCategory.Measurements]: false,
    [NodeCategory.Counters]: false,
    [NodeCategory.States]: false,
    [NodeCategory.Texts]: false,
    [NodeCategory.Other]: false,
} as RealTimeCardCategoriesState;

/** Initial expanded state with all real-time card categories expanded by default */
export const initialRealTimeCardCategoriesExpandState = {
    [NodeCategory.Measurements]: true,
    [NodeCategory.Counters]: true,
    [NodeCategory.States]: true,
    [NodeCategory.Texts]: true,
    [NodeCategory.Other]: true,
} as RealTimeCardCategoriesState;

/** Maps node categories to their corresponding Svelte display components for real-time cards */
export const realTimeDisplayComponentMap: Record<NodeCategory, typeof SvelteComponent<any> | null> = {
    [NodeCategory.Measurements]: Measurement,
    [NodeCategory.Counters]: Counter,
    [NodeCategory.States]: null, // Not implemented yet
    [NodeCategory.Texts]: Text,
    [NodeCategory.Other]: null, // Not implemented yet
};

/** Maps node categories to their corresponding graph component for log data visualization */
export const logsDisplayGraphComponentMap: Record<NodeCategory, typeof SvelteComponent<any> | null> = {
    [NodeCategory.Measurements]: MeasurementGraph,
    [NodeCategory.Counters]: CounterGraph,
    [NodeCategory.States]: null, // Not implemented yet
    [NodeCategory.Texts]: null, // Not implemented yet
    [NodeCategory.Other]: null, // Not implemented yet
};
