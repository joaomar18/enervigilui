<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import Logo from "../../General/Logo.svelte";
    import Link from "../Buttons/Link.svelte";
    import MenuButton from "../../General/MenuButton.svelte";
    import LangSelector from "../../General/LangSelector.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Variables
    let dropdownOpen: boolean;
    let headerElement: Node;

    // Functions
    function aboutUs(): void {}

    function help(): void {}

    function contacts(): void {}

    function handleClickOutsideHeader(event: MouseEvent): void {
        if (dropdownOpen && headerElement && !headerElement.contains(event.target as Node)) {
            dropdownOpen = false;
        }
    }

    function handleScreenResize(): void {
        if (browser && window.innerWidth >= 1024) {
            dropdownOpen = false;
        }
    }

    onMount(() => {
        if (browser) {
            window.addEventListener("click", handleClickOutsideHeader);
            window.addEventListener("resize", handleScreenResize);
            handleScreenResize();
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutsideHeader);
            window.removeEventListener("resize", handleScreenResize);
        }
    });
</script>

<!-- 
  Header: Responsive navigation header with logo, top navigation links, language selector,
  and a collapsible menu for smaller screens.
-->
<div class="header-div" bind:this={headerElement}>
    <div class="content-div">
        <div class="logo-div">
            <Logo />
        </div>
        <div class="links-header-div">
            <Link
                width="150px"
                height="40px"
                paddingLeft="10px"
                buttonText={$texts.aboutUs[$selectedLang]}
                imageURL="/img/info.png"
                imageRightPosition="10px"
                imageWidth="24px"
                imageHeight="24px"
                onClick={aboutUs}
            />
            <Link
                width="150px"
                height="40px"
                paddingLeft="10px"
                buttonText={$texts.help[$selectedLang]}
                imageURL="/img/help.png"
                imageRightPosition="10px"
                imageWidth="24px"
                imageHeight="24px"
                onClick={help}
            />
            <Link
                width="150px"
                height="40px"
                paddingLeft="10px"
                buttonText={$texts.contacts[$selectedLang]}
                imageURL="/img/customer-service.png"
                imageRightPosition="10px"
                imageWidth="24px"
                imageHeight="24px"
                onClick={contacts}
            />
        </div>
        <div class="language-selector-header-div">
            <LangSelector />
        </div>
        <div class="menu-button-div">
            <MenuButton backgroundColor="#252b33" bind:menuOpen={dropdownOpen} />
        </div>
    </div>
    <div class="dropdown-menu" class:open={dropdownOpen}>
        <Link
            width="100%"
            height="74px"
            paddingLeft="20px"
            paddingRight="20px"
            buttonText={$texts.aboutUs[$selectedLang]}
            imageURL="/img/info.png"
            imageWidth="46px"
            imageHeight="46px"
            imageRightPosition="20px"
            fontSize="20px"
            backgroundColor="#1f262d"
            hoverColor="#2c343d"
            borderBottomColor="#2c343d"
            onClick={aboutUs}
        />
        <Link
            width="100%"
            height="74px"
            paddingLeft="20px"
            paddingRight="20px"
            buttonText={$texts.help[$selectedLang]}
            imageURL="/img/help.png"
            imageWidth="46px"
            imageHeight="46px"
            imageRightPosition="20px"
            fontSize="20px"
            backgroundColor="#1f262d"
            hoverColor="#2c343d"
            borderBottomColor="#2c343d"
            onClick={help}
        />
        <Link
            width="100%"
            height="74px"
            paddingLeft="20px"
            paddingRight="20px"
            buttonText={$texts.contacts[$selectedLang]}
            imageURL="/img/customer-service.png"
            imageWidth="46px"
            imageHeight="46px"
            imageRightPosition="20px"
            fontSize="20px"
            backgroundColor="#1f262d"
            hoverColor="#2c343d"
            borderBottomColor="#2c343d"
            onClick={contacts}
        />
        <div class="language-selector-dropdown-div">
            <span class="language-text">{$texts.language[$selectedLang]}</span>
            <LangSelector />
        </div>
    </div>
</div>

<style>
    /* Main header container fixed at the top */
    .header-div {
        position: absolute;
        width: 100%;
        min-width: 320px;
        height: 74px;
        top: 0px;
        left: 0px;
        background-color: #1a1f26;
    }

    /* Content wrapper with centered layout */
    .content-div {
        min-width: 320px;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Logo container positioned top-left */
    .logo-div {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
    }

    /* Link buttons visible in desktop layout */
    .links-header-div {
        height: fit-content;
        width: 610px;
        top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    /* Dropdown menu shown only in mobile layout */
    .dropdown-menu {
        position: absolute;
        z-index: 3;
        height: fit-content;
        min-width: 320px;
        top: 74px;
        background-color: #252b33;
        border-bottom: 1px solid #37404a;
        width: 100%;
        display: none;
        justify-content: start;
        align-items: center;
        flex-direction: column;
    }

    /* Language selector container for header */
    .language-selector-header-div {
        position: absolute;
        right: 20px;
    }

    /* Language selector for dropdown menu */
    .language-selector-dropdown-div {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        padding: 30px;
    }

    /* Language label text styling */
    .language-text {
        color: #eeeeee;
        font-weight: 300;
        font-size: 18px;
        padding-bottom: 10px;
    }

    /* Mobile menu toggle button */
    .menu-button-div {
        display: none;
        position: absolute;
        right: 20px;
    }

    /* Responsive rules for small screens */
    @media (max-width: 1023px) {
        .links-header-div {
            display: none;
        }

        .language-selector-header-div {
            display: none;
        }

        .dropdown-menu.open {
            display: flex;
        }
        .menu-button-div {
            display: block;
        }
    }
</style>
