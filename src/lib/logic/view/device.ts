import { NodePhase, NodeSubSection } from "$lib/types/nodes/base";
import type { RealTimeCardSectionsState } from "$lib/types/view/device";


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
export function createEmptyRealTimeCardSubSectionsArrays(): Record<NodeSubSection, Array<any>> {
    return {
        [NodeSubSection.Measurements]: [],
        [NodeSubSection.Counters]: [],
        [NodeSubSection.States]: [],
        [NodeSubSection.Texts]: [],
        [NodeSubSection.Other]: [],
    };
}