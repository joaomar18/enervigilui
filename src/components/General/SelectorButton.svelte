<script>
    export let checked = false;

    function toggle() {
        checked = !checked;
    }
</script>

<div class="toggle {checked ? 'checked' : ''}" on:click={toggle}>
    <div class="knob"></div>
</div>

<style>
    .toggle {
        width: 75px;
        height: 20px;
        background-color: #3a3a3a;
        border-radius: 9999px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .knob {
        position: absolute;
        top: -6px;
        left: 0px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #2f80ed; /* bright blue */
        transition: transform 0.2s ease;
    }

    .checked .knob {
        transform: translateX(43px);
    }

    .checked {
        background-color: #4a4a4a;
    }
</style>
