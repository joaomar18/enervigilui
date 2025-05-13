export async function getAllDevicesState(
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch("/api/get_all_device_state", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}
