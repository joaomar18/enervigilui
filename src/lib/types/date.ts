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