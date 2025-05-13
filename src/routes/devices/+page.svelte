<script lang="ts">
    import { selectedLang, texts } from "../../stores/lang";
    import type { Language } from "../../stores/lang";

    import { getAllDevicesState } from "../../ts/devices";

    import { onMount, onDestroy } from "svelte";
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";
    import Alert from "../../components/General/Alert.svelte";

    let pollTimer: ReturnType<typeof setTimeout>;
    let devices: any;

    //Sorted devices
    $: sortedDevices = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

    //Function to poll devices status
    function startPolling() {
        const tick = async () => {
            try {
                const { status, data }: { status: number; data: any } = await getAllDevicesState();
                if (status !== 200) {
                    showAlert($texts.errorDevicesState);
                    return;
                }
                devices = data;
            } catch (e) {
                showAlert($texts.errorDevicesState);
            }
            pollTimer = setTimeout(tick, 3000);
        };
        tick();
    }

    // Alert State
    let displayAlert: boolean = false;
    let alertText: Record<Language, string>;
    let alertTimeout: number | undefined = undefined;

    // Function to create alert / delete old alerts
    function showAlert(textLang: Record<Language, string>): void {
        if (alertTimeout) {
            clearTimeout(alertTimeout);
        }
        alertText = textLang;
        displayAlert = true;
        alertTimeout = setTimeout(() => (displayAlert = false), 3000);
    }

    //Mount function to poll devices status
    onMount(() => {
        startPolling();
    });

    //Cleanup function
    onDestroy(() => {
        clearTimeout(pollTimer);
    });
</script>

<div class="container">
    <div class="alerts-div" class:toBack={!displayAlert}>
        {#if displayAlert}
            <Alert
                bottomPos="0px"
                alertText={alertText[$selectedLang]}
                backgroundColor="rgba(171, 34, 43, 0.25)"
                borderColor="#b91c1c"
                textColor="#ffd5d5"
                onClick={() => {
                    clearTimeout(alertTimeout);
                    alertTimeout = undefined;
                    displayAlert = false;
                }}
            />
        {/if}
    </div>
    <div class="content">
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
    .container {
        box-sizing: border-box;
        margin: 0;
        padding: 30px;
        height: 100%;
    }

    .container .alerts-div {
        position: fixed;
        bottom: 50px;
        height: 74px;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }
    .container .alerts-div.toBack {
        z-index: 0;
    }

    .container .content {
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        gap: 30px;
        justify-content: center;
    }
</style>
