<script lang="ts">
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {apps} from "../../../store";
    import {goto} from "$app/navigation";

    import AppSideBar from "./AppSideBar.svelte";
    import Note from "./Note.svelte";
    import Image from "./Image.svelte";
    import Video from "./Video.svelte";
    import {saveApps} from "../../../lib/database";

    let app = $apps.find(app => app.uuid === $page.params.appid);
    apps.subscribe(apps => {
        app = apps.find(app => app.uuid === $page.params.appid)
    });

    let path = "";

    let bg;

    let lastSave = Date.now();
    let saveInterval = 60000;
    let saveAgo = 0;

    let ctrlDown = false;

    function addContainer() {
        console.log("add container");
    }

    function addNote() {
        if (app.data.components) {
            app.data.components.push({
                type: "note",
                uuid: Math.random().toString(36).substr(2, 9),
                content: "",
                pos: {
                    x: -app.data.pos.x,
                    y: -app.data.pos.y
                },
                size: {
                    width: 200,
                    height: 200
                }
            });
            app = {...app};
        }
    }

    function addImage(file, pos = {x: 0, y: 0}) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (app.data.components) {
                app.data.components.push({
                    type: "image",
                    uuid: Math.random().toString(36).substr(2, 9),
                    pos: pos,
                    size: {
                        width: 200,
                        height: -1
                    },
                    src: reader.result.toString()
                });
                app = {...app};
            }
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    function addVideo(file, pos = {x: 0, y: 0}) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (app.data.components) {
                app.data.components.push({
                    type: "video",
                    uuid: Math.random().toString(36).substr(2, 9),
                    pos: pos,
                    size: {
                        width: 200,
                        height: -1
                    },
                    src: reader.result.toString()
                });
                app = {...app};
            }
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    function drag(event) {
        event = event || window.event;
        event.preventDefault();

        let startX = event.clientX;
        let startY = event.clientY;

        let appStartX = app.data.pos.x;
        let appStartY = app.data.pos.y;

        document.onmousemove = (event) => {
            app.data.pos.x = appStartX + event.clientX - startX;
            app.data.pos.y = appStartY + event.clientY - startY;
            bg.style.cursor = "grabbing";
        }

        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            bg.style.cursor = "context-menu";
        }
    }

    function initDragAndDrop() {
        const prevents = (event) => {
            event.preventDefault();

            if (event.type === "dragenter" || event.type === "dragover") bg.classList.add("bg-neutral/30");
            if (event.type === "dragleave" || event.type === "drop") bg.classList.remove("bg-neutral/30");

            if (event.type === "drop") {
                let pos = {
                    x: event.clientX - (window.screen.availWidth / 2) - app.data.pos.x,
                    y: event.clientY - (window.screen.availHeight / 2) - app.data.pos.y
                }

                const dataTransfer = event.dataTransfer;
                const files = [...dataTransfer.files];

                files.forEach(file => {
                    if (file.type.startsWith("image/")) {
                        addImage(file, pos);
                    }
                    if (file.type.startsWith("video/")) {
                        addVideo(file, pos);
                    }
                })
            }
        }

        bg.ondragenter = prevents;
        bg.ondragover = prevents;
        bg.ondragleave = prevents;
        bg.ondrop = prevents;
    }

    function updateApps() {
        $apps = [...$apps];
        setTimeout(() => updateApps(), 1000);
    }

    async function save() {
        $apps = [...$apps];
        const {error} = await saveApps($apps);
        if (error) console.log(error);
        else lastSave = Date.now();
    }

    function initSave() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "s" && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
                event.preventDefault();
                save();
            }
        });

        setInterval(() => {
            $apps = [...$apps];
            saveAgo = Math.round((Date.now() - lastSave) / 1000);
        }, 1000);

        save();
        setInterval(() => {
            save();
        }, saveInterval);
    }

    function initZoom() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Shift") ctrlDown = true;
        })

        document.addEventListener("keyup", (event) => {
            if (event.key === "Shift") ctrlDown = false;
        })

        document.addEventListener("wheel", (event) => {
            if (!ctrlDown) return;
            if (event.deltaY > 0) {
                app.data.size.width -= app.data.size.width / 20;
            } else {
                app.data.size.width += app.data.size.width / 20;
            }
            console.log(app.data.size.width);
        })
    }

    onMount(async () => {
        if (!app) await goto("/app");

        initDragAndDrop();
        updateApps();

        bg.onmousedown = (event) => {
            if (event.target === bg) drag(event)
        };
        bg.onclick = (event) => {
            if (event.target === bg) document.activeElement.blur();
        }

        initSave();
        initZoom();

        document.body.style.overflow = "hidden";
    });
</script>

<div>
    <div class="absolute w-screen h-screen duration-200" bind:this={bg}></div>
    {#if app}
        {#each app.data.components as component}
            {#if component.type === "note"}
                <Note app={app} path={path+component.uuid+"/"}/>
            {:else if component.type === "image"}
                <Image app={app} path={path+component.uuid+"/"}/>
            {:else if component.type === "video"}
                <Video app={app} path={path+component.uuid+"/"}/>
            {/if}
        {/each}
    {/if}
    <AppSideBar addContainer={addContainer} addNote={addNote}/>
    <p class="fixed left-5 bottom-5 text-white/30">Last save: {saveAgo} seconds ago</p>
</div>