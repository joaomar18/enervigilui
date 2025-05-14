<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState } from "$lib/ts/devices";

    // Stores for multi-language support
    import { texts } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/auth";

    //Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let deviceData: any;

    //Function to fetch device status
    function fetchDeviceStatus(name: string, id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceState(
                    name,
                    id
                );
                if (status !== 200) {
                    showAlert($texts.errorDeviceState);
                } else {
                    deviceData = data;
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceState);
            }
            loadedDone.set(true);
            if (!sucess) {
                pollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    // Mount function
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        let deviceName = params.get("deviceName");
        let deviceId = params.get("deviceId");
        if (deviceName && deviceId) {
            fetchDeviceStatus(deviceName, Number(deviceId));
        } else {
            showAlert($texts.errorEditDeviceParams);
            loadedDone.set(true);
        }
    });

    // Cleanup function
    onDestroy(() => {
        clearTimeout(pollTimer);
    });
</script>



<style>
</style>
