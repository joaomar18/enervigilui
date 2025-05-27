<script lang="ts">
    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
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
>
    <div class="content">
        <table>
            <thead>
                <tr>
                    <th>Variable</th>
                    <th>Unit</th>
                    <th>Communication ID</th>
                    <th>Logging Period</th>
                    <th>Calculated</th>
                    <th>Logging</th>
                    <th>Enabled</th>
                </tr>
            </thead>
        </table>
    </div>
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
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }
</style>
