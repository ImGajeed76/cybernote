<script lang="ts">
    import {apps, create} from "../../store";
    import AppViewer from "./AppViewer.svelte";
    import {onMount} from "svelte";
    import {getDBUser, saveApps, supabaseClient} from "$lib/database";

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
        const {error} = saveApps($apps);
        if (error) console.log(error);
    }

    let loggedIn = false;
    let loading = true;

    onMount(async () => {
        const {data, error} = await getDBUser("Apps");

        if (error) {
            console.log(error);
            return;
        } else {
            loggedIn = true;
        }
        loading = false;
    })
</script>

{#if loggedIn}
    {#if $apps.length === 0}
        <div class="m-10">
            <p class="text-center text-lg">(You have no apps)</p>
        </div>
    {:else}
        <div class="grid grid-cols grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each $apps as app}
                <AppViewer app={app}/>
            {/each}
        </div>
    {/if}

    <div class="divider">
        <button on:click={addApp} class="btn btn-primary btn-outline">New</button>
    </div>
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