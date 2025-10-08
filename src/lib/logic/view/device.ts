import { NodePhase, NodeType } from "$lib/types/nodes/base";
import { RealTimeCardSubSections } from "$lib/types/view/device";
import { subSectionComponentMap } from "$lib/types/view/device";
import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/base";
import type { RealTimeCardSectionsState } from "$lib/types/view/device";
import type { SvelteComponent } from "svelte";
import { LogSpanPeriod } from "$lib/types/view/nodes";

/**
 * Creates a mapping of all node phases to the same real-time card sections state
 *
 * Takes a single RealTimeCardSectionsState configuration and assigns it to all
 * available node phases (L1, L2, L3, TOTAL, GENERAL, SINGLEPHASE), creating
 * a complete phase-to-state mapping with consistent section visibility settings
 * across all phases.
 *
 * @param state - The real-time card sections state configuration to apply to all phases
 * @returns A record mapping each NodePhase to a copy of the provided sections state
 */
export function assignRealTimeCardSectionsStateToAllPhases(state: RealTimeCardSectionsState): Record<NodePhase, RealTimeCardSectionsState> {
    return {
        [NodePhase.L1]: { ...state },
        [NodePhase.L2]: { ...state },
        [NodePhase.L3]: { ...state },
        [NodePhase.TOTAL]: { ...state },
        [NodePhase.GENERAL]: { ...state },
        [NodePhase.SINGLEPHASE]: { ...state },
    } as Record<NodePhase, RealTimeCardSectionsState>;
}

/**
 * Factory function that creates fresh empty array containers for real-time card subsection data.
 *
 * This function returns a new object with all subsection types (Measurements, Counters, States,
 * Texts, Other) initialized as empty arrays. Each call creates completely independent array
 * instances, preventing shared reference issues when organizing processed node data by phase
 * and subsection.
 *
 * Unlike createEmptyRealTimeCardSubSections() which returns empty objects for generic data storage,
 * this function specifically creates empty arrays suitable for storing collections of ProcessedNodeState
 * objects or other array-based data structures.
 *
 * Use this when you need array containers for storing ordered collections of node data that will
 * be populated using array methods like push(), rather than object property assignment.
 *
 * @returns A fresh object with all RealTimeCardSubSections keys mapped to empty array instances
 */
export function createEmptyRealTimeCardSubSectionsArrays(): Record<RealTimeCardSubSections, Array<any>> {
    return {
        [RealTimeCardSubSections.Measurements]: [],
        [RealTimeCardSubSections.Counters]: [],
        [RealTimeCardSubSections.States]: [],
        [RealTimeCardSubSections.Texts]: [],
        [RealTimeCardSubSections.Other]: [],
    };
}

/**
 * Determines the appropriate real-time card subsection for a node based on its data type and characteristics.
 * @param nodeState - The node state object to categorize (NodeState or ProcessedNodeState).
 * @returns The RealTimeCardSubSections enum value indicating which subsection the node belongs to.
 */
export function getNodeSubSection(nodeState: NodeState | ProcessedNodeState) {
    let subsection: RealTimeCardSubSections;

    if (nodeState.type === NodeType.FLOAT || nodeState.type === NodeType.INT) {
        if (nodeState.incremental) {
            subsection = RealTimeCardSubSections.Counters;
        } else {
            subsection = RealTimeCardSubSections.Measurements;
        }
    } else if (nodeState.type === NodeType.BOOLEAN) {
        subsection = RealTimeCardSubSections.States;
    } else if (nodeState.type === NodeType.STRING) {
        subsection = RealTimeCardSubSections.Texts;
    } else {
        subsection = RealTimeCardSubSections.Other;
    }

    return subsection;
}

/**
 * Returns the appropriate Svelte component for displaying a node based on its subsection type.
 * @param nodeState - The node state object to get the display component for.
 * @returns The Svelte component constructor for rendering the node.
 * @throws Error if the subsection type is not implemented or unknown.
 */
export function getDisplayComponent(nodeState: NodeState | ProcessedNodeState): typeof SvelteComponent<any> {
    let subSection = getNodeSubSection(nodeState);

    const component = subSectionComponentMap[subSection];
    if (component === null || component === undefined) {
        throw Error(`${subSection} subsection component not implemented.`);
    }

    return component;
}

/**
 * Converts a log period enum to complete date ranges for full periods.
 * @param period - The time span period to convert
 * @returns Object with initial_date (period start) and end_date (next period start)
 */
export function getTimeSpanFromLogPeriod(period: LogSpanPeriod): { initial_date: Date; end_date: Date } {
    let initial_date = new Date();
    let end_date: Date;

    switch (period) {
        case LogSpanPeriod.currentHour:
            initial_date.setMinutes(0, 0, 0);
            end_date = new Date(initial_date);
            end_date.setHours(end_date.getHours() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.currentDay:
            initial_date.setHours(0, 0, 0, 0);
            end_date = new Date(initial_date);
            end_date.setDate(end_date.getDate() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.current7Days:
            initial_date.setHours(0, 0, 0, 0);
            while (initial_date.getDay() != 1) {
                initial_date.setDate(initial_date.getDate() - 1);
            }
            end_date = new Date(initial_date);
            end_date.setDate(end_date.getDate() + 7);
            return { initial_date, end_date };

        case LogSpanPeriod.currentMonth:
            initial_date.setHours(0, 0, 0, 0);
            initial_date.setDate(1);
            end_date = new Date(initial_date);
            end_date.setMonth(end_date.getMonth() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.currentYear:
            initial_date.setHours(0, 0, 0, 0);
            initial_date.setMonth(0, 1);
            end_date = new Date(initial_date);
            end_date.setFullYear(end_date.getFullYear() + 1);
            return { initial_date, end_date };

        default:
            throw new Error(`Invalid Log Span Period: ${period}`);
    }
}
