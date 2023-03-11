<script>
    import Container from "./Container.svelte";
    import {onMount} from "svelte";
    import Note from "./Note.svelte";

    export let path;
    export let app;

    let div;

    let component = {
        components: []
    };

    function updateComponent() {
        component = app.data;
        if (path === "" || !path) return;
        let splitPath = path.split("-");
        splitPath.shift();
        splitPath.pop();
        for (let i = 0; i < splitPath.length; i++) {
            component = component.components[splitPath[i]];
        }
    }

    function updatePosition() {
        let left = component.pos.x - app.data.pos.x + (window.screen.availWidth / 2) - (div.offsetWidth / 2);
        let top = component.pos.y - app.data.pos.y + (window.screen.availHeight / 2) - (div.offsetHeight / 2);
        div.style.left = left + 'px';
        div.style.top = top + 'px';
    }

    onMount(() => {
        console.log(path);
        updateComponent();
        if (component.title !== "main") updatePosition();
    })
</script>

<div class="absolute" bind:this={div}>
    {#each component.components as child, i}
        {#if child.type === "container"}
            <div class="w-60 h-40 bg-neutral rounded shadow p-5">
                <p class="text-xl">{child.title}</p>
                <Container path={`${path}${i}-`} app={app}/>
            </div>
        {:else if child.type === "note"}
            <Note component={child} app={app}/>
        {/if}
    {/each}
</div>

