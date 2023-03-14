<script lang="ts">
    import Component from "./Component.svelte";
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;
    export let addState;

    let textarea;
    let hiddenDiv;
    let component: any;

    function getComponent() {
        component = app.data;
        if (path === "" || !path) return;
        let splitPath = path.split("/");
        splitPath.pop();
        for (let i = 0; i < splitPath.length; i++) {
            if ("components" in component && component.components) {
                component = component.components.find((component) => component.uuid === splitPath[i]);
            }
        }
    }

    function disable() {
        textarea.disabled = true;
        textarea.style.cursor = "context-menu";
        textarea.style.pointerEvents = "none";
    }

    function enable() {
        textarea.disabled = false;
        textarea.style.cursor = "text";
        textarea.style.pointerEvents = "auto";
    }

    function focus() {
        textarea.focus();
    }

    function resizeFont() {
        if (!textarea) return;

        textarea.style.fontSize = "16px";
        const containerHeight = component.size.height;
        const maxFontSize = 100;
        const minFontSize = 10;
        const fontSize = Math.round(Math.min(maxFontSize, Math.max(minFontSize, 0.1 * containerHeight)));
        textarea.style.fontSize = fontSize + "px";

        const padding = Math.round((containerHeight) / 2.5);
        textarea.style.paddingTop = padding + "px";
    }

    onMount(() => {
        getComponent();
        setInterval(() => {
            resizeFont();
        }, 200);
    });
</script>

<Component path={path} app={app} focus={focus} disable={disable} enable={enable} addState={addState}>
    {#if component}
            <textarea class="w-full h-full outline-none bg-transparent text-center duration-500"
                      style="resize: none; overflow: hidden" bind:this={textarea}
                      bind:value={component.content} placeholder="some text"></textarea>
    {/if}
</Component>