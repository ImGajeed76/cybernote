<script lang="ts">
    import Component from "./Component.svelte";
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;
    export let addState;
    export let appContainer;

    let component: any;
    let videoType: string;
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
        if (component.src.startsWith("data")){
            videoType = component.src.split(";")[0].split("/").pop();
        } else {
            videoType = component.src.split(".").pop();
        }
    });
</script>

<Component path={path} app={app} addState={addState} appContainer={appContainer}>
    {#if component}
        <video controls class="w-full h-full rounded">
            <source src={component.src} type="video/{videoType}">
            Your browser does not support the video tag.
        </video>
    {/if}
</Component>