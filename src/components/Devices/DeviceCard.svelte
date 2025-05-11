<script lang="ts">
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
</script>

<div style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
    "
    class="container">
    <div class="content">

    </div>
</div>

<style>
    .container{
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
    }

    .content{
        padding:0;
        margin:0;
        width:100%;
        height:100%;
        position:relative;
    }
</style>