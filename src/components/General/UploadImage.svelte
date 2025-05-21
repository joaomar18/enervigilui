<script lang="ts">
    //Props
    export let imageFile: File | undefined;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "0px";
    export let imageUrl: string;
    export let imageWidth: string = "auto";
    export let imageHeight: string = "auto";
    export let backgroundColor: string;
    export let hoverColor: string = backgroundColor;

    //Functions
    let fileInput: HTMLInputElement;

    function openPicker() {
        fileInput.click();
    }

    function onFileChange() {
        const file = fileInput.files?.[0];
        if (!file) return;
        imageFile = file;
        imageUrl = URL.createObjectURL(imageFile);
    }
</script>

<!-- Image upload wrapper: shows the current image with a pencil overlay and lets users click to pick a new file -->
<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
    "
    class="container"
>
    <div class="content" style="background-image: url('{imageUrl}')">
        <img class="edit-pencil-img" src="/img/edit_pencil.png" alt="Edit Pencil" />

        <input
            type="file"
            accept="image/*"
            bind:this={fileInput}
            on:change={onFileChange}
            style="display:none"
        />

        <button class="upload-image-btn" aria-label="Upload Image Button" on:click={openPicker}
        ></button>
    </div>
</div>

<style>
    /* Wrapper: sets size, shape, and background color with smooth hover transition */
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        transition: background-color 0.2s ease;
    }

    /* Hover state: slightly lighten background */
    .container:hover {
        background-color: var(--hover-color);
    }

    /* Hover state: increase pencil icon opacity */
    .container:hover .content .edit-pencil-img {
        opacity: 0.75;
    }

    /* Content area: positions image background and centers children */
    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius);
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: center;
        background-repeat: no-repeat;
        background-size: var(--image-width) var(--image-height);
    }

    /* Pencil overlay: centered, semi-transparent, transitions on hover */
    .content .edit-pencil-img {
        width: 50%;
        height: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.25;
        transition: opacity 0.2s ease;
    }

    /* Invisible button overlay: captures clicks for file picker */
    .content button {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border-radius: var(--border-radius);
        background: transparent;
        border: none;
        cursor: pointer;
    }
</style>
