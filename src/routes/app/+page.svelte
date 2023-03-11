<script lang="ts">
    import {apps, create} from "../../store";
    import AppViewer from "./AppViewer.svelte";

    function genUUID() {
        let uuid = Math.random().toString(36).substr(2, 9)

        if ($apps.find(app => app.uuid === uuid)) {
            return genUUID();
        }

        return uuid;
    }

    function addApp() {
        create({
            name: "New App",
            description: "New App Description",
            uuid: genUUID(),
            data: {
                pos: {
                    x: 0,
                    y: 0,
                },
                title: "main",
                type: "container",
                components: []
            }
        });
    }
</script>

<div class="grid grid-cols grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each $apps as app}
        <AppViewer app={app} />
    {/each}
</div>

<div class="divider">
    <button on:click={addApp} class="btn btn-primary btn-outline">Add</button>
</div>