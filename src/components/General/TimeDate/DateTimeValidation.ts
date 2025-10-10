export function validateStringNumber(value: string, max: number, min: number = 0, zeroPadding: number = 2): string {
    let validValue = value.replace(/[^0-9]/g, "");
    let numberValue = Number(validValue);
    if (numberValue > max) {
        numberValue = max;
    }
    else if (numberValue < min || isNaN(numberValue)) {
        numberValue = min;
    }
    return String(numberValue).padStart(zeroPadding, "0");
}