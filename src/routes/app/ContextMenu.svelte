<script lang="ts">
    import {onMount} from "svelte";

    export let options: { label: string, color: string }[];
    export let selected = 0;
    export let onselect: (index: number, event) => void = (index) => {
        console.log(index);
    };
    export let controller;

    let open = false;
    let div;

    const close = () => {
        open = false;
        div.style.left = "-1000px";
        div.style.top = "-1000px";
    }

    onMount(() => {
        setTimeout(() => {
            controller.oncontextmenu = (event) => {
                event.preventDefault();
                div.style.top = event.clientY - 2 + "px";
                div.style.left = event.clientX - 2 + "px";
                open = true;

                div.onmouseleave = () => {
                    close();
                }
            }
        }, 100)
    })
</script>

<div class="fixed w-40 h-fit" bind:this={div} style="z-index: 99">
    {#if open}
        <div class="w-full h-fit bg-neutral border border-base-100 rounded shadow-2xl">
            {#each options as option, i}
                <div class="w-full h-8 flex items-center justify-center hover:bg-base-100 cursor-pointer rounded duration-200"
                     on:click={(event) => {
                         selected = i;
                         onselect(i, event);
                         close();
                     }}>
                    <p class="text-{option.color}">{option.label}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>