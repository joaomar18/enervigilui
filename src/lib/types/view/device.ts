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

/** Empty subsection structure with all real-time card subsections initialized as empty objects */
export const emptyRealTimeCardSubSections = {
    [RealTimeCardSubSections.Measurements]: {},
    [RealTimeCardSubSections.Counters]: {},
    [RealTimeCardSubSections.States]: {},
    [RealTimeCardSubSections.Texts]: {},
    [RealTimeCardSubSections.Other]: {},
} as Record<RealTimeCardSubSections, Record<any, any>>;

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
