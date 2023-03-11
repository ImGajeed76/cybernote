<script lang="ts">
    import type {App} from "../../store";

    export let app: App;
</script>

<a class="card card-compact w-96 bg-base-100 shadow-xl m-10 hover:shadow-2xl duration-300" href="/app/{app.uuid}">
    <figure>
        <div class="w-full h-44 relative">
            <img class="object-cover w-full h-full" src={app.data.thumb || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"} alt={app.name} />
        </div>
    </figure>
    <div class="card-body">
        <h2 class="card-title">{app.name}</h2>
        <p>{app.description}</p>
    </div>
</a>