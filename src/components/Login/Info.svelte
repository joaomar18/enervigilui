<script lang="ts">
    //Stores for multi-language support
    import { selectedLang, texts } from "../../lib/stores/lang";

    // Layout / styling props
    export let paddingTop: string = "0px";
    export let paddingBottom: string = "0px";
    export let appImageUrl: string | undefined;
</script>

<!-- 
  InfoSection: Displays language-based heading and subheading,
  followed by a circular background image.
-->
<div
    class="container"
    style="
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
    "
>
    <div class="content">
        <h1>
            {$texts.infoMainMessage[$selectedLang]}
        </h1>
        <h3>
            {$texts.infoSubMessage[$selectedLang]}
        </h3>
        <div
            class="app-image"
            style="
                --background-image-url: url({appImageUrl})
            "
        ></div>
    </div>
</div>

<style>
    /* Outer wrapper with configurable vertical padding */
    .container {
        width: 100%;
        margin: 0;
        padding: 0;
        margin-top: 20px;
        padding-top: var(--padding-top, 0px);
        padding-bottom: var(--padding-bottom, 0px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Content layout (stacked, centered) */
    .content {
        width: fit-content;
        height: fit-content;
        display: flex;
        justify-content: start;
        flex-direction: column;
        align-items: center;
    }

    /* Main heading */
    h1 {
        text-align: left;
        font-size: 1.75rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 400;
        white-space: pre-line;
        color: #eeee;
        line-height: 50px;
        padding: 0;
        margin: 0;
        padding-bottom: 30px;
    }

    /* Sub heading */
    h3 {
        text-align: left;
        font-size: 1.25rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 300;
        white-space: pre-line;
        color: #eeee;
        padding: 0;
        margin: 0;
        padding-bottom: 50px;
    }

    /* Circular image container with dynamic background image */
    .app-image {
        width: 256px;
        height: 256px;
        background-color: #1a1f26;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: var(--background-image-url);
        box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
        background-size: 75%;
    }
</style>
