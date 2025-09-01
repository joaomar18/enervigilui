<script lang="ts">
    import { navigateTo } from "$lib/logic/view/navigation";
    import { processInitialDevice } from "$lib/logic/factory/device";
    import { getAllDevicesState } from "$lib/logic/api/device";
    import { filterDevices } from "$lib/logic/util/device";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";

    // Texts
    import { selectedLang } from "$lib/stores/lang/definition";

    // Stores for authorization
    import { loadedDone, searchQuery } from "$lib/stores/view/navigation";

    //Types
    import type { DeviceMeter } from "$lib/types/device/base";

    import { onMount, onDestroy } from "svelte";
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";

    // Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let devices: Array<DeviceMeter>;
    let devicesImg: Record<number, string> = {};

    // Sorted devices
    $: sortedDevices = filterDevices(devices, $searchQuery);

    // Function to poll devices status
    function startPolling() {
        const tick = async () => {
            try {
                const { status, data }: { status: number; data: any } = await getAllDevicesState();
                if (status !== 200) {
                    showToast("errorDevicesState", ToastType.ALERT, {
                        error: String(data["error"]),
                    });
                } else {
                    devices = data.map((data: DeviceMeter & { image: Record<string, string> }) => {
                        const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
                        let deviceData: DeviceMeter = processInitialDevice(requestDeviceData as DeviceMeter);
                        devicesImg[deviceData.id] = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
                        return deviceData;
                    });
                }
            } catch (e) {
                showToast("errorDevicesState", ToastType.ALERT, {
                    error: String(e),
                });
                console.error(`Could not obtain devices state: ${e}`);
            }
            loadedDone.set(true);
            pollTimer = setTimeout(tick, 2500);
        };
        tick();
    }

    // Mount function to poll devices status
    onMount(() => {
        startPolling();
    });

    // Cleanup function
    onDestroy(() => {
        clearTimeout(pollTimer);
    });

    // Go to edit device page
    async function editDevice(deviceId: number, deviceName: string): Promise<void> {
        await navigateTo("devices/edit", $selectedLang, {
            deviceId: String(deviceId),
            deviceName: deviceName,
        });
    }

    // Go to add device page
    async function addDevice(): Promise<void> {
        await navigateTo("devices/add", $selectedLang);
    }
</script>

<!--
  Devices Page: renders a loading spinner until `loaded` is true,
  then displays a grid of DeviceCard components followed by the AddDevice button.
-->
<div class="content">
    {#each sortedDevices as device (device.id)}
        <DeviceCard
            deviceID={device.id}
            deviceName={device.name}
            connected={device.connected}
            notifications={""}
            imageURL={devicesImg[device.id]}
            onEdit={() => editDevice(device.id, device.name)}
            onEnter={() => {
                /* ... */
            }}
        />
    {/each}
    <AddDevice onClick={() => addDevice()} />
</div>

<style>
    /* Main content grid for device cards and AddDevice button */
    .content {
        padding: 0;
        margin: 0;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        gap: 30px;
        justify-content: center;
    }
</style>
