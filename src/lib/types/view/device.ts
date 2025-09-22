import type { SvelteComponent } from "svelte";
import Measurement from "../../../components/Devices/Nodes/RealTimeDisplay/Measurement.svelte";
import Counter from "../../../components/Devices/Nodes/RealTimeDisplay/Counter.svelte";
import Text from "../../../components/Devices/Nodes/RealTimeDisplay/Text.svelte";

/** String literal keys for all real-time card subsections */
export enum RealTimeCardSubSections {
    Measurements = "Measurements",
    Counters = "Counters",
    States = "States",
    Texts = "Texts",
    Other = "Other",
}

/** Configuration for which real-time card sections are active/visible */
export interface RealTimeCardSectionsState {
    Measurements: boolean;
    Counters: boolean;
    States: boolean;
    Texts: boolean;
    Other: boolean;
}

/** Default state with all real-time card sections disabled */
export const defaultRealTimeCardSectionsState = {
    Measurements: false,
    Counters: false,
    States: false,
    Texts: false,
    Other: false,
} as RealTimeCardSectionsState;

/** Initial expanded state with all real-time card sections expanded by default */
export const initialRealTimeCardSectionsExpandState = {
    Measurements: true,
    Counters: true,
    States: true,
    Texts: true,
    Other: true,
} as RealTimeCardSectionsState;

/**
 * Mapping of real-time card subsections to their corresponding Svelte display components.
 * This object maps each subsection type to the appropriate component for rendering node data.
 */
export const subSectionComponentMap: Record<RealTimeCardSubSections, typeof SvelteComponent<any> | null> = {
    [RealTimeCardSubSections.Measurements]: Measurement,
    [RealTimeCardSubSections.Counters]: Counter,
    [RealTimeCardSubSections.States]: null, // Not implemented yet
    [RealTimeCardSubSections.Texts]: Text,
    [RealTimeCardSubSections.Other]: null, // Not implemented yet
};
