<script lang="ts">
    import Selector from "../General/Selector.svelte";
    import SelectorButton from "../General/SelectorButton.svelte";
    import HintInfo from "../General/HintInfo.svelte";
    import { getDefaultNodesList } from "$lib/ts/factory/nodes";

    // Types
    import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/stores/devices";
    import type { EditableDeviceNode } from "$lib/stores/nodes";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { meterTypeTexts } from "$lib/stores/lang/energyMeterTexts";

    // Props
    export let deviceData: EditableDeviceMeter | NewDeviceMeter;
    export let nodes: Array<EditableDeviceNode>;
    export let meterOptionsValid: boolean;

    // Variables
    let validMeterType: boolean;

    $: validMeterType = Object.keys($meterTypeTexts).includes(deviceData.type);
    $: meterOptionsValid = validMeterType;
</script>

<!--
  MeterOptionsConfig: This component renders the configuration options for energy meter devices,
  including connection type, energy reading options, and various meter-specific settings.
-->
<div class="device-input-div">
    <span>{$texts.connectionType}</span>
    <div class="input-div">
        <Selector
            options={$meterTypeTexts}
            bind:selectedOption={deviceData.type}
            inputInvalid={!validMeterType}
            enableInputInvalid={true}
            onChange={() => {
                nodes = getDefaultNodesList(deviceData);
            }}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.connectionTypeInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.readEnergyFromMeter}</span>
    <div class="input-div">
        <div class="input-content-div">
            <SelectorButton bind:checked={deviceData.options.read_energy_from_meter} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.readEnergyFromMeterInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.readForwardReverseEnergySeparate}</span>
    <div class="input-div">
        <div class="input-content-div">
            <SelectorButton bind:checked={deviceData.options.read_separate_forward_reverse_energy} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.readForwardReverseEnergySeparateInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.negativeReactivePower}</span>
    <div class="input-div">
        <div class="input-content-div">
            <SelectorButton bind:checked={deviceData.options.negative_reactive_power} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.negativeReactivePowerInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.frequencyReading}</span>
    <div class="input-div">
        <div class="input-content-div">
            <SelectorButton bind:checked={deviceData.options.frequency_reading} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.frequencyReadingInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<style>
    /* Device input row styling */
    .device-input-div {
        position: relative;
        margin-top: 30px;
        min-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
    }

    /* Label text for device input fields */
    .device-input-div span {
        text-align: left;
        color: #f5f5f5;
        font-size: 1rem;
        line-height: 1.5;
        font-weight: 400;
        margin: 0;
        padding: 0;
        width: 250px;
    }

    /* Input field container styling */
    .input-div {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin: 0;
        padding: 0;
        width: fit-content;
        height: 100%;
    }

    /* Content area for input fields */
    .input-div .input-content-div {
        width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Info text styling for hints */
    .info-div .info-text {
        padding: 10px;
        padding-right: 40px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: white;
    }
</style>
