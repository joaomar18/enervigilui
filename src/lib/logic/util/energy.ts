import { PowerFactorDirection } from "$lib/types/device/energy";

/**
 * Converts power factor direction enum to a short display string for UI presentation.
 * Returns "c" for capacitive/leading power factor, "i" for inductive/lagging power factor,
 * or empty string for unknown/unitary cases.
 * 
 * @param pfDirection - The power factor direction as a string enum value
 * @returns Single character string ("c", "i") or empty string
 */
export function getPowerFactorDirectionString(pfDirection: string): string {
    let pfDirEnum = pfDirection as PowerFactorDirection;
    switch (pfDirEnum) {
        case PowerFactorDirection.UNKNOWN:
            return "";
        case PowerFactorDirection.UNITARY:
            return "";
        case PowerFactorDirection.LEADING:
            return "c";
        case PowerFactorDirection.LAGGING:
            return "i";
    }
}