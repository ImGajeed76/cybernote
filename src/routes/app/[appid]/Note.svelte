<script lang="ts">
    import Component from "./Component.svelte";
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;
    export let addState;

    let textarea;
    let component: any;
    let placeholder;

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
        placeholder.style.fontSize = fontSize + "px";

        if (textarea.innerHTML === "" || textarea.innerHTML === "<br>") {
            textarea.innerHTML = "<br>";
            placeholder.innerHTML = "some text";
        } else {
            placeholder.innerHTML = "";
        }
    }

    onMount(() => {
        getComponent();
        setInterval(() => {
            resizeFont();
        }, 200);

        setTimeout(() => {
            textarea.oninput = () => {
                resizeFont();
            };
        }, 1000);
    });
</script>

<Component path={path} app={app} focus={focus} disable={disable} enable={enable} addState={addState}>
    {#if component}
        <div class="w-full h-full outline-none bg-transparent justify-center content-center text-center flex flex-col duration-200 focus:outline-white outline-1 rounded-sm"
             style="resize: none; overflow: hidden" bind:this={textarea}
             bind:innerHTML={component.content} contenteditable="true"></div>
        <div bind:this={placeholder} class="left-0 top-0 text-white/30 w-full h-full absolute bg-transparent justify-center content-center text-center flex flex-col">some text</div>
    {/if}
</Component>