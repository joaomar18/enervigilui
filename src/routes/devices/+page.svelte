<script lang="ts">
    import { onMount } from "svelte";
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";
    import { navigateTo } from "$lib/logic/view/navigation";
    import { getAllDevicesState, getAllDevicesStateWithImage } from "$lib/logic/api/device";
    import { filterDevices } from "$lib/logic/util/device";
    import { MethodPoller } from "$lib/logic/api/poller";

    // Stores
    import { searchQuery } from "$lib/stores/view/navigation";

    //Types
    import type { DeviceMeter } from "$lib/types/device/base";

    // Variables
    let devices: Array<DeviceMeter>;
    let devicesImages: Record<number, string> = {};

    // Sorted devices
    $: sortedDevices = filterDevices(devices, $searchQuery);

    // Go to edit device page
    async function editDevice(deviceId: number, deviceName: string): Promise<void> {
        await navigateTo("devices/edit", {
            deviceId: String(deviceId),
            deviceName: deviceName,
        });
    }

    // Go to add device page
    async function addDevice(): Promise<void> {
        await navigateTo("devices/add");
    }

    // Mount function to poll devices status
    onMount(() => {
        let devicesPoller: MethodPoller | null = null;
        let devicesWithImagesPoller: MethodPoller | null = new MethodPoller(async (signal) => {
            ({ devices, devicesImages } = await getAllDevicesStateWithImage());

            // Stop images polling and start devices polling
            devicesWithImagesPoller?.stop();
            devicesWithImagesPoller = null;
            devicesPoller = new MethodPoller(
                async (signal) => {
                    ({ devices } = await getAllDevicesState());
                },
                3000,
                false,
            );
        }, 3000);

        //Clean-up logic
        return () => {
            devicesPoller?.stop();
            devicesWithImagesPoller?.stop();
            devicesPoller = null;
            devicesWithImagesPoller = null;
        };
    });
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
            imageURL={devicesImages[device.id]}
            onEdit={() => editDevice(device.id, device.name)}
            onInfo={() => {
                /* ... */
            }}
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
        gap: 20px;
        justify-content: center;
    }
</style>
