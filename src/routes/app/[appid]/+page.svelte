<script>
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {apps, update} from "../../../store";
    import {goto} from "$app/navigation";
    import {writable} from "svelte/store";

    import AppSideBar from "./AppSideBar.svelte";
    import Container from "./Container.svelte";

    let app = $apps.find(app => app.uuid === $page.params.appid);
    apps.subscribe(apps => {
        app = apps.find(app => app.uuid === $page.params.appid);
    });

    let path = "main-";

    onMount(async () => {
        if (!app) {
            await goto("/app");
        }
    });

    function addContainer() {
        console.log("add container");
    }

    function addNote() {
        app.data.components.push({
            title: "test",
            type: "note",
            content: "(Some text)",
            pos: {
                x: 0,
                y: 0,
            }
        });
        update(app.uuid, app.data);
    }
</script>

<Container path={path} app={app} />
<AppSideBar addContainer={addContainer} addNote={addNote}/>