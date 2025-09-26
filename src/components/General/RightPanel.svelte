<script lang="ts">
    import { tick } from "svelte";
    import { onDestroy } from "svelte";

    // Props
    export let useMask: boolean = true;
    export let showPanel: boolean;

    // Layout / styling props
    export let maskBlurFilter: string | undefined = "8px";
    export let maskBackground: string | undefined = "rgba(24, 29, 35, 0.25)";
    export let width: string | undefined = "100vw";
    export let maxWidth: string | undefined = "420px";
    export let paddingTop: string | undefined = "10px";
    export let paddingBottom: string | undefined = "20px";
    export let paddingHorizontal: string | undefined = "10px";
    export let backgroundColor: string | undefined = "#1c2026";
    export let borderLeft: string | undefined = "1px solid rgba(255, 255, 255, 0.08)";
    export let shadow: string | undefined = "-4px 0 12px rgba(0, 0, 0, 0.6)";

    export let titlePaddingLeft: string | undefined = "0px";
    export let titlePaddingRight: string | undefined = "20px";
    export let titlePaddingBottom: string | undefined = "5px";
    export let borderBottomTitle: string | undefined = "1px solid white";

    export let headerPaddingHorizontal: string | undefined = "";
    export let headerPaddingTop: string | undefined = "";
    export let headerPaddingBottom: string | undefined = "";
    export let borderBottomHeader: string | undefined = "1px solid white";

    export let closeButtonWidth: string | undefined = "40px";
    export let closeButtonHeight: string | undefined = "40px";
    export let closeButtonImageWidth: number | undefined = 32;
    export let closeButtonImageHeight: number | undefined = 32;
    export let closeButtonColor: string | undefined = "white";
    export let closeButtonHoverColor: string | undefined = "gray";

    export let contentMarginTop: string | undefined = "20px";
    export let contentMarginBottom: string | undefined = "0px";
    export let contentPaddingHorizontal: string | undefined = "0px";

    export let scrollbarTrackColor: string | undefined = "#323a45";
    export let scrollbarThumbColor: string | undefined = "#1e242b";

    // Variables
    let contentEl: HTMLDivElement;
    let closePanelEventListenerDefined: boolean = false;

    // Reactive Statements
    $: if (useMask && showPanel && !closePanelEventListenerDefined) {
        requestAnimationFrame(() => {
            window.addEventListener("click", handleClickOutside);
            closePanelEventListenerDefined = true;
        });
    }

    $: if (!showPanel && closePanelEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        closePanelEventListenerDefined = false;
    }

    // Functions
    async function handleClickOutside(event: MouseEvent): Promise<void> {
        await tick();
        if (showPanel && contentEl && !contentEl.contains(event.target as Node)) {
            showPanel = false;
        }
    }

    function closePanel(): void {
        showPanel = false;
        if (closePanelEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
            closePanelEventListenerDefined = false;
        }
    }

    onDestroy(() => {
        if (closePanelEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

{#if useMask && showPanel}
    <div
        style="
            --mask-blur-filter: {maskBlurFilter};
            --mask-background-color: {maskBackground};
        "
        class="mask"
    ></div>
{/if}

<div
    bind:this={contentEl}
    style="
        --width: {width};
        --max-width: {maxWidth};
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
        --padding-horizontal: {paddingHorizontal};
        --background-color: {backgroundColor};
        --border-left: {borderLeft};
        --shadow: {shadow};

        --title-padding-left: {titlePaddingLeft};
        --title-padding-right: {titlePaddingRight};
        --title-padding-bottom: {titlePaddingBottom};
        --border-bottom-title: {borderBottomTitle};

        --header-padding-horizontal: {headerPaddingHorizontal};
        --header-padding-top: {headerPaddingTop};
        --header-padding-bottom: {headerPaddingBottom};
        --border-bottom-header: {borderBottomHeader};

        --close-button-width: {closeButtonWidth};
        --close-button-height: {closeButtonHeight};
        --close-button-color: {closeButtonColor};
        --close-button-hover-color: {closeButtonHoverColor};

        --content-margin-top: {contentMarginTop};
        --content-margin-bottom: {contentMarginBottom};
        --content-padding-horizontal: {contentPaddingHorizontal};
        --scrollbar-track-color: {scrollbarTrackColor};
        --scrollbar-thumb-color: {scrollbarThumbColor};
    "
    class="content"
    class:open={showPanel}
>
    <div class="top-div">
        <div class="title-div">
            <div class="title-content">
                <slot name="title"></slot>
            </div>
            <button class="close-button" on:click={closePanel} aria-label="Close Window">
                <svg
                    width={closeButtonImageWidth}
                    height={closeButtonImageHeight}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke=""
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                </svg></button
            >
        </div>
        <div class="header-div" style="height:200px;">
            <slot name="header"></slot>
        </div>
    </div>
    <div class="content-div">
        <slot />
    </div>
</div>

<style>
    .mask {
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--mask-background-color);
        backdrop-filter: blur(var(--mask-blur-filter));
        -webkit-backdrop-filter: blur(var(--mask-blur-filter));
        z-index: 108;
    }

    .content {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        right: 0;
        top: 0;
        bottom: 0;
        position: fixed;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        width: var(--width);
        max-width: var(--max-width);
        background-color: var(--background-color);
        border-left: var(--border-left);
        box-shadow: var(--shadow);
        transform: translateX(100%);
        transition: transform 0.2s ease-in-out;
        z-index: 109;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    .content.open {
        transform: translateX(0%);
    }

    .top-div {
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    .close-button {
        margin: 0;
        padding: 0;
        width: var(--close-button-width);
        height: var(--close-button-height);
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* SVG icon for close button */
    .close-button svg {
        stroke: var(--close-button-color);
        transition: stroke 0.2s ease;
    }

    /* Close button hover effect */
    .close-button:hover svg {
        stroke: var(--close-button-hover-color);
    }

    .top-div .title-div {
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        border-bottom: var(--border-bottom-title);
        display: flex;
        justify-content: space-between;
        align-items: start;
    }

    .top-div .title-div .title-content {
        flex: 1;
        height: var(--close-button-height);
        padding-left: var(--title-padding-left);
        padding-right: var(--title-padding-right);
        padding-bottom: var(--title-padding-bottom);
        min-width: 0;
        overflow: hidden;
    }

    .top-div .header-div {
        margin: 0;
        padding: 0;
        width: 100%;
        padding-left: var(--header-padding-horizontal);
        padding-right: var(--header-padding-horizontal);
        padding-top: var(--header-padding-top);
        padding-bottom: var(--header-padding-bottom);
        border-bottom: var(--border-bottom-header);
    }

    /* Content area: fills remaining space */
    .content-div {
        padding: 0;
        margin: 0;
        margin-top: var(--content-margin-top);
        margin-bottom: var(--content-margin-bottom);
        padding-left: var(--content-padding-horizontal);
        padding-right: var(--content-padding-horizontal);
        width: 100%;
        min-height: 0;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }
</style>
