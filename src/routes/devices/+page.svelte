<script lang="ts">
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
    import AddDevice from "../../components/Devices/AddDevice.svelte";
</script>

<div class="container">
    <div class="content">
        <DeviceCard
            deviceID={1}
            deviceName="OR-WE-516 Energy Meter"
            connected={true}
            width="300px"
            height="400px"
            borderRadius="20px"
            backgroundColor="#14161c"
            borderColor="rgba(255,255,255,0.07)"
            imageURL="/devices/OR-WE-516 Energy Meter.png"
        />
        <DeviceCard
            deviceID={2}
            deviceName="S7-1200 SM238 Energy Meter"
            connected={false}
            width="300px"
            height="400px"
            borderRadius="20px"
            backgroundColor="#14161c"
            borderColor="rgba(255,255,255,0.07)"
            imageURL="/devices/S7-1200 SM1238 Energy Meter.png"
        />
        <AddDevice
            width="300px"
            height="400px"
            borderRadius="20px"
            backgroundColor="#14161c"
            borderColor="rgba(255,255,255,0.07)"
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
