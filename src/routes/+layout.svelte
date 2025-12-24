<script lang="ts">
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { beforeNavigate, afterNavigate } from "$app/navigation";
    import { initializeClientLayout, resolveNavigationRedirect, navigateTo } from "$lib/logic/view/navigation";
    import { isAuthenticationPage, isDashboardPage } from "$lib/logic/view/navigation";
    import { closeToast } from "$lib/logic/view/toast";
    import { setInitialLeftPanelState } from "$lib/logic/view/navigation";
    import { syncUIState } from "$lib/logic/view/navigation";
    import SplashLoader from "../components/Dashboard/SplashLoader.svelte";
    import DashboardContainer from "../components/Dashboard/DashboardContainer.svelte";

    // Authorization stores
    import { currentPage, splashDone, userAuthenticated } from "$lib/stores/view/navigation";

    // On Mount Function
    onMount(async () => {
        setInitialLeftPanelState();
        await initializeClientLayout();
    });

    beforeNavigate(({ to, cancel }) => {
        if (!to) return;
        let result = resolveNavigationRedirect(to.url, get(userAuthenticated));
        if (result.shouldRedirect) {
            cancel();
            navigateTo(result.redirectTarget, {}, false, true);
            return;
        }
    });

    afterNavigate(({ to }) => {
        if (!to) return;
        closeToast();
        syncUIState(to.url);
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
