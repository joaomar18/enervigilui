<script lang="ts">
    import { navigateTo } from "$lib/ts/navigation";
    import { getAllDevicesState } from "$lib/ts/devices";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/navigation";

    //Types
    import type { DeviceMeter } from "$lib/stores/devices";

    import { onMount, onDestroy } from "svelte";
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";

    // Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let devices: Array<DeviceMeter>;
    let devicesImg: Record<number, string> = {};

    // Sorted devices
    $: sortedDevices = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

    // Function to poll devices status
    function startPolling() {
        const tick = async () => {
            try {
                const { status, data }: { status: number; data: any } = await getAllDevicesState();
                if (status !== 200) {
                    showAlert($texts.errorDevicesState, {
                        error: String(data["error"]),
                    });
                } else {
                    devices = data.map((data: DeviceMeter & { image: Record<string, string> }) => {
                        const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
                        let deviceData: DeviceMeter = requestDeviceData as DeviceMeter;
                        devicesImg[deviceData.id] = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
                        return deviceData;
                    });
                }
            } catch (e) {
                showAlert($texts.errorDevicesState, {
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
            width="300px"
            height="400px"
            borderRadius="20px"
            backgroundColor="#14161c"
            borderColor="rgba(255,255,255,0.07)"
            imageURL={devicesImg[device.id]}
            defaultImageURL="/img/default-device.png"
            imageBackgroundColor="rgba(255, 255, 255, 0.1)"
            imageWidth="200px"
            imageHeight="200px"
            onEdit={() => editDevice(device.id, device.name)}
            onEnter={() => {
                /* ... */
            }}
        />
    {/each}
    <AddDevice
        width="300px"
        height="400px"
        borderRadius="20px"
        backgroundColor="#14161c"
        borderColor="rgba(255,255,255,0.07)"
        imageBackgroundColor="rgba(255, 255, 255, 0.1)"
        imageWidth="200px"
        imageHeight="200px"
        strokeColor="#9E9E9E"
        strokeSelectedColor="#e0e0e0"
        onClick={() => addDevice()}
    />
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
