<script lang="ts">
    // Stores for multi-language support
    import { texts } from "../../lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "../../lib/stores/alerts";

    import { getAllDevicesState } from "../../lib/ts/devices";

    import { onMount, onDestroy } from "svelte";
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";

    // Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let devices: any;
    let loaded: boolean = false;

    // Sorted devices
    $: sortedDevices = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

    // Function to poll devices status
    function startPolling() {
        const tick = async () => {
            try {
                const { status, data }: { status: number; data: any } = await getAllDevicesState();
                if (status !== 200) {
                    showAlert($texts.errorDevicesState);
                } else {
                    devices = data;
                }
            } catch (e) {
                showAlert($texts.errorDevicesState);
            }
            loaded = true;
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
</script>

<!--
  Devices Page: renders a loading spinner until `loaded` is true,
  then displays a grid of DeviceCard components followed by the AddDevice button.
-->
<div class="container">
    <div class="content">
        <div class="loader-div" class:close={loaded}>
            <div class="spinner"></div>
        </div>
        {#each sortedDevices as device (device.id)}
            <DeviceCard
                deviceID={device.id}
                deviceName={device.name}
                connected={device.connected}
                notifications={device.notifications ?? ""}
                width="300px"
                height="400px"
                borderRadius="20px"
                backgroundColor="#14161c"
                borderColor="rgba(255,255,255,0.07)"
                imageURL={`/devices/${device.name}_${device.id}.png`}
                imageBackgroundColor="rgba(255, 255, 255, 0.1)"
                imageWidth="200px"
                imageHeight="200px"
                onEdit={() => {
                    /* ... */
                }}
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
            onClick={() => {}}
        />
    </div>
</div>

<style>
    /* Container: outer wrapper with padding and full height */
    .container {
        box-sizing: border-box;
        margin: 0;
        padding: 30px;
        height: 100%;
    }

    /* Content: grid layout centering 300px cards with gaps */
    .container .content {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        gap: 30px;
        justify-content: center;
    }

    /* Loader overlay: full-screen dark backdrop with centered spinner */
    .container .content .loader-div {
        position: absolute;
        inset: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: calc(100vh - 74px - 60px);
        height: 100%;
        background-color: #181d23;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }

    /* Loader hidden state: fade out and drop behind content */
    .container .content .loader-div.close {
        opacity: 0;
        z-index: 0;
    }

    /* Spinner: circular border animation */
    .spinner {
        width: 128px;
        height: 128px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    /* Spin animation: full rotation */
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
