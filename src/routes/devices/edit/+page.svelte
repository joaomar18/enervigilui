<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState } from "$lib/ts/devices";
    import Selector from "../../../components/General/Selector.svelte";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/auth";

    //Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let deviceData: any;
    let protocols = { "OPC UA": "OPC_UA", "MODBUS RTU": "MODBUS_RTU" };
    let selectedProtocol: string;

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

<div class="content">
    <div class="edit-device-div">
        <div class="device-identification-div">
            <h3>{deviceData?.name}</h3>
            <div
                class="device-image-div"
                style="background-image: url('{`/devices/${deviceData?.name}_${deviceData?.id}.png`}');"
            ></div>
        </div>
        <div class="device-options-div">
            <div class="device-options-title">
                <h3>{$texts.deviceOptions[$selectedLang]}</h3>
                <span>{$texts.deviceOptionsSub[$selectedLang]}</span>
            </div>
            <Selector options={protocols} bind:selectedOption={selectedProtocol} />
        </div>
    </div>
</div>

<style>
    .content {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .edit-device-div {
        height: 100%;
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .device-identification-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-identification-div h3 {
        color: #f5f5f5;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        font-weight: 300;
    }

    .device-identification-div .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: 200px;
        height: 200px;
        background-color: rgba(255, 255, 255, 0.1);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 87.5%;
        border-radius: 50%;
    }

    .device-options-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .device-options-div .device-options-title {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        gap: 10px;
        padding: 20px;
        padding-left: 0px;
        padding-right: 0px;
        width: 100%;
    }

    .device-options-div h3 {
        color: #f5f5f5;
        font-size: 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    .device-options-div span {
        color: rgb(170, 170, 170);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 400;
        margin: 0;
        padding: 0;
    }
</style>
