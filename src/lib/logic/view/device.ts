import { NodePhase } from "$lib/types/nodes/base";
import type { RealTimeCardSectionsState } from "$lib/types/view/device";

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