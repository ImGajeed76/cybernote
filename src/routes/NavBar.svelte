<script>
    import {onMount} from "svelte";
    import {saveApps, supabaseClient} from "$lib/database";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import {apps} from "../store";

    let user;
    let isAbsolute = false;

    let activeTab = 0;
    page.subscribe((page) => {
        if (page.url.pathname === '/') {
            activeTab = 0;
        } else if (page.url.pathname.startsWith('/app')) {
            activeTab = 1;
        }
    })

    async function updateUser() {
        const {data: sessionData, error: sessionError} = await supabaseClient.auth.getSession();

        if (sessionError) {
            console.log(sessionError);
            user = null;
        } else if (sessionData && sessionData.session) {
            user = sessionData.session.user;
        } else {
            user = null;
        }
    }

    page.subscribe(async () => {
        isAbsolute = $page.url.pathname.startsWith("/login") || $page.url.pathname.startsWith("/app/");
    })

    onMount(async () => {
        if ($page.url.pathname === '/') {
            activeTab = 0;
        } else if ($page.url.pathname.startsWith('/app')) {
            activeTab = 1;
        }

        await updateUser();
    })

    async function logout() {
        const {error: saveError} = await saveApps($apps);

        if (saveError) {
            console.log(saveError);
        }

        const {error} = await supabaseClient.auth.signOut();
        if (error) {
            console.log(error);
        } else {
            await updateUser();
            window.location.reload();
        }
    }
</script>

<div class="navbar bg-neutral {isAbsolute ? 'absolute' : ''} h-16 relative shadow-2xl" style="z-index: 9999">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">CyberNote</a>
        <div class="absolute w-[99vw] flex">
            <div class="tabs m-auto">
                <a href="/" class="tab tab-bordered {activeTab === 0 ? 'tab-active' : ''} duration-500 outline-none">Home</a>
                <a href="/app" class="tab tab-bordered {activeTab === 1 ? 'tab-active' : ''} duration-500 outline-none">App</a>
            </div>
        </div>
    </div>
    <div class="flex-none gap-2">
        {#if user}
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-12 rounded-full">
                        <img src={user.user_metadata.avatar_url}/>
                    </div>
                </label>
                <ul tabindex="0"
                    class="mt-3 p-2 shadow-2xl menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                        <button class="text-error" on:click={logout}>Logout</button>
                    </li>
                </ul>
            </div>
        {:else}
            <button class="btn btn-primary btn-outline" on:click={() => goto('/login')}>Login</button>
        {/if}
    </div>
</div>