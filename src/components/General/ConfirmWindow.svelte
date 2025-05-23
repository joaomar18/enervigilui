<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy, tick } from "svelte";

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = "transparent";

    //Variables
    let containerEl: HTMLElement;

    // Click Export Funcion
    export let closeWindow: () => void;

    function handleClickOutside(event: MouseEvent): void {
        if (containerEl && !containerEl.contains(event.target as HTMLElement)) {
            if (closeWindow) {
                closeWindow();
            }
        }
    }

    onMount(() => {
        if (browser) {
            requestAnimationFrame(() => {
                window.addEventListener("click", handleClickOutside);
            });
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};

    "
    class="container"
    bind:this={containerEl}
>
    <div class="content"></div>
</div>

<style>
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
    }

    .content {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
</style>
