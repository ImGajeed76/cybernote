<script lang="ts">
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    export let apps;
    export let index;

    let card;

    onMount(() => {
        card.ondblclick = (event) => {
            if (event.target.tagName === "INPUT") return;
            event.preventDefault();
            goto(`/app/${$apps[index].uuid}`)
        }

        card.onclick = (event) => {
            if (event.target.tagName === "INPUT") return;
            event.preventDefault();
            goto(`/app/${$apps[index].uuid}`)
        }
    })
</script>

<div class="card card-compact w-96 bg-base-100 shadow-xl m-10 hover:shadow-2xl duration-300" bind:this={card}
     tabindex="0" style="cursor: pointer;">
    <figure class="hover:shadow-xl duration-300">
        <div class="w-full h-44 relative">
            <img class="object-cover w-full h-full"
                 src={$apps[index].data.thumb || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"}
                 alt={$apps[index].name}/>
        </div>
    </figure>
    <div class="card-body bg-transparent">
        <input class="card-title input bg-transparent p-2" bind:value={$apps[index].name} placeholder="title">
        <input class="input input-sm bg-transparent p-2" bind:value={$apps[index].description}
               placeholder="description">
    </div>
</div>