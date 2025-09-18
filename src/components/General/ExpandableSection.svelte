<script lang="ts">
    // Props
    export let titleText: string;
    export let contentExpanded: boolean = false;

    // Layout / styling props
    export let width: string | undefined = "calc(100%)";
    export let paddingTop: string | undefined = "5px";
    export let paddingBottom: string | undefined = "5px";
    export let headerHeight: string | undefined = "fit-content";
    export let headerBorderBottom: string | undefined = "1px solid rgba(255, 255, 255, 0.07)";
    export let headerPaddingBottom: string | undefined = "5px";
    export let titleSize: string | undefined = "14px";
    export let titleColor: string | undefined = "rgba(255, 255, 255, 0.7)";
    export let titleWeight: string | undefined = "400";
    export let titleMarginLeft: string | undefined = "10px";
    export let expandButtonWidth: string | undefined = "40px";
    export let expandButtonHeight: string | undefined = "40px";
    export let expandButtonHoverColor: string | undefined = "#1c1f26";
    export let expandButtonMarginRight: string | undefined = "0px";
    export let expandButtonArrowWidth: string | undefined = "24px";
    export let expandButtonArrowHeight: string | undefined = "24px";

    // Functions
    function toogleExpand() {
        contentExpanded = !contentExpanded;
    }
</script>

<div
    style="
        --width: {width};
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
        --header-height: {headerHeight};
        --header-border-bottom: {headerBorderBottom};
        --header-padding-bottom: {headerPaddingBottom};
        --title-size: {titleSize};
        --title-color: {titleColor};
        --title-weight: {titleWeight};
        --title-margin-left: {titleMarginLeft};
        --expand-button-width: {expandButtonWidth};
        --expand-button-height: {expandButtonHeight};
        --expand-button-hover-color: {expandButtonHoverColor};
        --expand-button-margin-right: {expandButtonMarginRight};
        --expand-button-arrow-width: {expandButtonArrowWidth};
        --expand-button-arrow-height: {expandButtonArrowHeight};
    "
    class="container"
>
    <div class="content">
        <div class="header">
            <div class="header-content">
                <h3>{titleText}</h3>
                <div class="arrow-div">
                    <img
                        class="arrow"
                        src={contentExpanded ? "/img/up-arrow.svg" : "/img/down-arrow.svg"}
                        alt={contentExpanded ? "up-arrow" : "down-arrow"}
                    />
                </div>
                <button on:click={toogleExpand} aria-label="Absolute header button"></button>
            </div>
        </div>
        <div class="section-content" class:close={!contentExpanded}>
            <div class="wrapper">
                <slot />
            </div>
        </div>
    </div>
</div>

<style>
    .container {
        width: var(--width);
        height: fit-content;
        margin: 0;
        padding: 0;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
    }

    .content {
        width: 100%;
        height: fit-content;
        position: relative;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .section-content {
        width: 100%;
        flex: 1 1 auto;
        display: grid;
        grid-template-rows: 1fr;
        transition: grid-template-rows 0.2s ease-in-out;
        overflow: hidden;
    }

    .section-content.close {
        grid-template-rows: 0fr;
        flex: 0 0 auto;
        pointer-events: none;
    }

    .section-content .wrapper {
        min-height: 0;
        overflow: hidden;
    }

    .header {
        width: 100%;
        height: var(--header-height);
        border-bottom: var(--header-border-bottom);
    }

    .header .header-content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: var(--header-padding-bottom);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header .header-content:hover {
        background-color: var(--expand-button-hover-color);
    }

    .header .header-content h3 {
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
        padding: 0;
        margin: 0;
        margin-left: var(--title-margin-left);
    }

    .header .header-content .arrow-div {
        width: var(--expand-button-width);
        height: var(--expand-button-height);
        border-radius: 50%;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: var(--expand-button-margin-right);
    }

    .header .header-content .arrow-div img {
        width: var(--expand-button-arrow-width);
        height: var(--expand-button-arrow-height);
    }

    .header .header-content button {
        position: absolute;
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        cursor:pointer;
    }
</style>
