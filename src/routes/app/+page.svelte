<script lang="ts">
    import {apps, create} from "../../store";
    import AppViewer from "./AppViewer.svelte";
    import {onMount} from "svelte";
    import {getDBUser, saveApps} from "../../lib/database";

    let lastSave = Date.now();
    let saveInterval = 60000;
    let saveAgo = 0;

    function genUUID() {
        let uuid = Math.random().toString(36).substr(2, 9)

        if ($apps.find(app => app.uuid === uuid)) {
            return genUUID();
        }

        return uuid;
    }

    async function addApp() {
        create({
            name: "New App",
            description: "New App Description",
            uuid: genUUID(),
            data: {
                pos: {
                    x: 0,
                    y: 0,
                },
                size: {
                    width: 100,
                    height: 0,
                },
                uuid: genUUID(),
                title: "main",
                type: "container",
                components: []
            }
        });
        $apps = [...$apps];
    }

    let loggedIn = false;
    let loading = true;

    async function save() {
        const {error} = await saveApps($apps);
        if (error) console.log(error);
        else lastSave = Date.now();
    }

    function initSave() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "s" && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
                event.preventDefault();
                save();
            }
        });

        setInterval(() => {
            $apps = [...$apps];
            saveAgo = Math.round((Date.now() - lastSave) / 1000);
        }, 1000);

        save();
        setInterval(() => {
            save();
        }, saveInterval);
    }

    onMount(async () => {
        const {data, error} = await getDBUser("Apps");

        if (error) {
            console.log(error);
            return;
        } else if (data) {
            loggedIn = true;
        }
        loading = false;

        initSave();
    })
</script>

{#if loggedIn}
    {#if $apps.length === 0}
        <div class="m-10">
            <p class="text-center text-lg">(You have no apps)</p>
        </div>
    {:else}
        <div class="grid grid-cols grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each $apps as app, i}
                <AppViewer apps={apps} index={i}/>
            {/each}
        </div>
    {/if}

    <div class="divider">
        <button on:click={addApp} class="btn btn-primary btn-outline">New</button>
    </div>

    <p class="fixed left-5 bottom-5 text-white/30">Last save: {saveAgo} seconds ago</p>
{:else if !loading}
    <div class="h-[90vh] grid items-center">
        <p class="text-center text-2xl italic">Please <a href="/login" class="underline">login</a></p>
    </div>
{:else}
    <div class="h-[90vh] grid items-center justify-center">
        <div>
            <button class="btn btn-ghost loading w-full"></button>
            <p class="text-center">Loading...</p>
        </div>
    </div>
{/if}