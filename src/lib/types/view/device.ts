import { NodeSubSection } from "../nodes/base";
import type { SvelteComponent } from "svelte";
import Measurement from "../../../components/Devices/Nodes/RealTimeDisplay/Measurement.svelte";
import Counter from "../../../components/Devices/Nodes/RealTimeDisplay/Counter.svelte";
import Text from "../../../components/Devices/Nodes/RealTimeDisplay/Text.svelte";

/** Configuration for which real-time card sections are active/visible */
export type RealTimeCardSectionsState = Record<NodeSubSection, boolean>;

/** Default state with all real-time card sections disabled */
export const defaultRealTimeCardSectionsState = {
    [NodeSubSection.Measurements]: false,
    [NodeSubSection.Counters]: false,
    [NodeSubSection.States]: false,
    [NodeSubSection.Texts]: false,
    [NodeSubSection.Other]: false,
} as RealTimeCardSectionsState;

/** Initial expanded state with all real-time card sections expanded by default */
export const initialRealTimeCardSectionsExpandState = {
    [NodeSubSection.Measurements]: true,
    [NodeSubSection.Counters]: true,
    [NodeSubSection.States]: true,
    [NodeSubSection.Texts]: true,
    [NodeSubSection.Other]: true,
} as RealTimeCardSectionsState;

export const realTimeComponentMap: Record<NodeSubSection, typeof SvelteComponent<any> | null> = {
    [NodeSubSection.Measurements]: Measurement,
    [NodeSubSection.Counters]: Counter,
    [NodeSubSection.States]: null, // Not implemented yet
    [NodeSubSection.Texts]: Text,
    [NodeSubSection.Other]: null, // Not implemented yet
};
