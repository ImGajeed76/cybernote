<script lang="ts">
    import {supabaseClient} from "../../lib/database";
    import {onMount} from "svelte";

    async function signInWithGitHub() {
        const {data, error} = await supabaseClient.auth.signInWithOAuth({
            provider: 'github'
        });

        if (error) {
            console.log(error);
        }
    }

    onMount(() => {
        signInWithGitHub();
    });
</script>

<div class="h-[90vh] grid items-center justify-center">
    <div>
        <button class="btn btn-ghost loading w-full"></button>
        <p class="text-center">Logging you in</p>
    </div>
</div>