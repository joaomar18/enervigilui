import { NodePhase } from "$lib/types/nodes/base";
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
export function assignRealTimeCardSectionsStateToAllPhases(state: RealTimeCardSectionsState) {
    return {
        [NodePhase.L1]: { ...state },
        [NodePhase.L2]: { ...state },
        [NodePhase.L3]: { ...state },
        [NodePhase.TOTAL]: { ...state },
        [NodePhase.GENERAL]: { ...state },
        [NodePhase.SINGLEPHASE]: { ...state },
    } as Record<NodePhase, RealTimeCardSectionsState>;
}