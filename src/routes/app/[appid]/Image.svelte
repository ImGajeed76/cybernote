<script lang="ts">
    import Component from "./Component.svelte";
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;
    export let addState;

    let component: any;
    let image;
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

    onMount(() => {
        getComponent();
        if (component.size.height === -1) {
            let image = new Image();
            image.src = component.src;
            image.onload = () => {
                component.size.height = (image.height / image.width) * component.size.width;
            }
        }
        setTimeout(() => {
            if (!image) return;
            image.ondragstart = (event) => {event.preventDefault()};
        }, 100);
    });
</script>

<Component path={path} app={app} addState={addState}>
    {#if component}
        <img src={component.src} alt="image" class="rounded" style="width: 100%; height: 100%; object-fit: cover" bind:this={image}>
    {/if}
</Component>