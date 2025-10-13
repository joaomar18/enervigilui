
/**
 * Converts a 2-digit year to a 4-digit year by choosing the century closest to the current year.
 * @param yy - Two-digit year (0-99)
 * @returns Four-digit year in the century closest to the current date
 */
export function interpretYY(yy: string): string {

    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    const yearCurrCentury = currentCentury + Number(yy);
    const yearPrevCentury = (currentCentury - 100) + Number(yy);
    const yearNextCentury = currentCentury + 100 + Number(yy);

    const candidates = [yearCurrCentury, yearPrevCentury, yearNextCentury];
    return String(candidates.reduce((closest, candidate) => {
        const diffCurrent = Math.abs(currentYear - candidate);
        const diffClosest = Math.abs(currentYear - closest);
        return diffCurrent < diffClosest ? candidate : closest;
    }));
}

export function getShortYear(yyyy: string): string {
    console.log(typeof (yyyy));
    return yyyy.slice(-2);
}