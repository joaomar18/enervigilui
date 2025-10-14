/**
 * Represents a complete date and time with string-formatted fields.
 * Used for form inputs where each component is handled as a separate string value.
 */
export interface DateTimeField {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
}

/**
 * Validation result for a date-time range with detailed error breakdown.
 * Provides granular validation status for each component and overall validity.
 */
export interface DateTimeSpanValidation {
    validStartDate: boolean;
    validStartTime: boolean;
    validEndDate: boolean;
    validEndTime: boolean;
    invalidRange: boolean;
    valid: boolean;
}