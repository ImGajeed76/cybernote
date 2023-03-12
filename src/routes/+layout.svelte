<script>
    import '../app.css'
    import NavBar from "./NavBar.svelte";
    import {onMount} from "svelte";
    import {createDBUser, getDBUser} from "$lib/database";
    import {apps} from "../store";

    onMount(async () => {
        const {data: getData, error: getError, session} = await getDBUser("Apps")

        if (getError) {
            const {error: createError} = await createDBUser("Apps", {
                email: session.session.user.email,
                apps: {apps: [
                        {
                            uuid: Math.random().toString(36).substr(2, 9),
                            name: "App 1",
                            description: "Congrats, here is your first app!",
                            data: {
                                pos: {
                                    x: 0,
                                    y: 0,
                                },
                                size: {
                                    width: 100,
                                    height: 100,
                                },
                                uuid: Math.random().toString(36).substr(2, 9),
                                title: "main",
                                type: "container",
                                components: []
                            }
                        }
                    ]}
            })

            if (createError) {
                console.log(createError)
            } else {
                window.location.reload()
            }
        } else {
            $apps = getData.apps.apps
        }
    })
</script>

<NavBar/>
<slot/>
