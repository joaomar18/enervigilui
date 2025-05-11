<script lang="ts">
    import DeviceCard from "../../components/Devices/DeviceCard.svelte";
</script>

<div class="container">
    <div class="content">
        <DeviceCard width="250px" height="350px" borderRadius="20px" backgroundColor="#14161c" borderColor="rgba(255,255,255,0.07)" />
        <DeviceCard width="250px" height="350px" borderRadius="20px" backgroundColor="#14161c" borderColor="rgba(255,255,255,0.07)" />
        <DeviceCard width="250px" height="350px" borderRadius="20px" backgroundColor="#14161c" borderColor="rgba(255,255,255,0.07)" />
    </div>
</div>

<style>
    .container {
        box-sizing: border-box;
        margin:0;
        padding: 20px;
        height:100%;
    }

    .container .content {
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, 250px);
        gap:20px;
        justify-content: center;
    }
</style>
