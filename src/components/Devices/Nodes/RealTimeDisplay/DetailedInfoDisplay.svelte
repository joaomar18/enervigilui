<script lang="ts">
    // Props
    export let showDetailedInfo: boolean;
</script>

<div class="detailed-info-div" class:close={!showDetailedInfo}>
    <div class="content"></div>
</div>

<style>
    .detailed-info-div {
        margin: 0;
        padding: 0;
        width: 100%;
        height:fit-content;
        max-height: 300px;
        background-color: black;
        min-height: 0;
        transition: max-height 0.2s ease-in-out;
        overflow: hidden;
        border-radius: 20px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
    }

    .detailed-info-div.close {
        max-height: 0;
    }

    .content {
        width: 100%;
        height: 100px;
    }
</style>
