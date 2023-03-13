<script lang="ts">
    import {getDBUser, supabaseClient} from "../../lib/database";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    async function isSignedIn() {
        const {data, error} = await getDBUser("Apps");
        if (error) {
            console.log(error);
            return false;
        } else return !!data;
    }

    async function signInWithGitHub() {
        const {error} = await supabaseClient.auth.signInWithOAuth({
            provider: 'github'
        });

        if (error) {
            console.log(error);
        }
    }

    onMount(async () => {
        let signedIn = await isSignedIn();
        console.log(signedIn);
        if (signedIn) {
            await goto("/app")
        } else {
            await signInWithGitHub();
        }
    });
</script>

<div class="h-[90vh] grid items-center justify-center">
    <div>
        <button class="btn btn-ghost loading w-full"></button>
        <p class="text-center">Redirecting</p>
    </div>
</div>