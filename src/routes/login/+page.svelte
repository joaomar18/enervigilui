<script lang="ts">
    import { fade } from "svelte/transition";
    import Header from "../../components/Login/Header.svelte";
    import Info from "../../components/Login/Info.svelte";
    import Login from "../../components/Login/Login.svelte";
</script>

<!-- 
  LoginPage: Entry route for login.
  Displays a header, login form, and optional info section on large screens.
-->
<div class="container" in:fade={{ duration: 300 }}>
    <Header />
    <div class="column" id="first-col">
        <Login />
    </div>
    <div class="column" id="second-col">
        <Info appImageUrl="/img/smart-meter.png" />
    </div>
</div>

<style>
    /* Main container uses grid layout */
    .container {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
        min-width: 350px;
        min-height: 600px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-items: center;
    }

    /* Shared styling for both columns */
    .column {
        width: 100%;
        padding: 0;
        margin: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 74px;
        box-sizing: border-box;
    }

    /* Left column - login form */
    #first-col {
        background-color: #181d23;
    }

    /* Right column - info (hidden by default) */
    #second-col {
        background: #202731;
        display: none;
    }

    /* On desktop: show both columns */
    @media (min-width: 1280px) {
        .column {
            width: 50vw;
        }
        .container {
            grid-template-columns: 1fr 1fr;
        }
        #second-col {
            display: flex;
        }
    }
</style>
