<script lang="ts">
    import { onMount } from "svelte";
    import { initLayout } from "$lib/logic/view/navigation";
    import { isAuthenticationPage, isDashboardPage, updateScrollingState } from "$lib/logic/view/navigation";
    import { setInitialLeftPanelState } from "$lib/logic/view/navigation";
    import SplashLoader from "../components/Dashboard/SplashLoader.svelte";

    // Authorization stores
    import { currentPage, splashDone, loadedDone } from "$lib/stores/view/navigation";
    import DashboardContainer from "../components/Dashboard/DashboardContainer.svelte";

    // Reactive Statements
    $: updateScrollingState($splashDone && $loadedDone); // Enable scrolling after content loaded

    // On Mount Function
    onMount(async () => {
        setInitialLeftPanelState();
        await initLayout();
    });
</script>

<!-- 
  Layout Wrapper:  
    • Shows splash screen until app initialization completes.  
    • After initialization, renders DashboardContainer (with sidebar, header, and content area) for dashboard pages.
    • On authentication pages (/login), renders only the page content directly.  
-->
{#if !$splashDone}
    <SplashLoader />
{:else if isDashboardPage($currentPage)}
    <DashboardContainer>
        <slot />
    </DashboardContainer>
{:else if isAuthenticationPage($currentPage)}
    <slot />
{/if}
