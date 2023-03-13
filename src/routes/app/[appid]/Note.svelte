<script lang="ts">
    import Component from "./Component.svelte";
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;
    export let addState;

    let textarea;
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
        textarea.style.cursor = "context-menu"
    }

    function enable() {
        textarea.disabled = false;
        textarea.style.cursor = "text"
    }

    function focus() {
        textarea.focus();
    }

    onMount(() => {
        getComponent();
    });
</script>

<Component path={path} app={app} focus={focus} disable={disable} enable={enable} addState={addState}>
    {#if component}
        <textarea class="w-full h-full bg-transparent p-2" style="resize: none; overflow: hidden" bind:this={textarea}
                  bind:value={component.content} placeholder="some text"></textarea>
    {/if}
</Component>