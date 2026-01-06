/**
 * Defines the available sections of the application's left navigation panel.
 *
 * Each enum value represents a distinct functional area of the system UI,
 * used to control routing, visibility, and user interaction within the
 * left-side panel.
 *
 * @enum LeftPanelSection
 * @property DEVICES        Device management and monitoring section
 * @property CONNECTIVITY   Communication and connectivity configuration
 * @property HEALTH         System health and status overview
 * @property LOGS           Application and system log viewer
 * @property SETTINGS       General application and system settings
 * @property BACKUP         Backup and restore management
 */
export enum LeftPanelSection {
    DEVICES = "devices",
    CONNECTIVITY = "connectivity",
    HEALTH = "health",
    LOGS = "logs",
    SETTINGS = "settings",
    BACKUP = "backup",
}
