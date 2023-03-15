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

    let lastAppStates = [];
    let maxAppStates = 10;

    function addState() {
        lastAppStates.push({...app});
        if (lastAppStates.length > maxAppStates) lastAppStates.shift();
    }

    let path = "";

    let bg;
    let bgPattern;
    let appContainer;

    let lastSave = Date.now();
    let saveInterval = 60000;
    let saveAgo = 0;

    let ctrlDown = false;

    function addContainer() {
        console.log("add container");
    }

    function addNote(file?, pos?) {
        if (app.data.components) {
            app.data.components.push({
                type: "note",
                uuid: Math.random().toString(36).substr(2, 9),
                content: file?.content || "",
                pos: {
                    x: (pos?.x || (window.screen.availWidth / 2) - app.data.pos.x) - 100,
                    y: (pos?.y || (window.screen.availHeight / 2) - app.data.pos.y) - 100
                },
                size: {
                    width: 200,
                    height: 200
                }
            });
            app = {...app};
            addState();
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
            addState();
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
            addState();
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
            event.preventDefault();
            app.data.pos.x = appStartX + event.clientX - startX;
            app.data.pos.y = appStartY + event.clientY - startY;

            requestAnimationFrame(() => {
                bgPattern.style.backgroundPosition = `${app.data.pos.x}px ${app.data.pos.y}px`;

                appContainer.style.left = `${app.data.pos.x}px`;
                appContainer.style.top = `${app.data.pos.y}px`;
            })

            bg.style.cursor = "grabbing";
        }

        document.onmouseup = (event) => {
            event.preventDefault();
            document.onmouseup = null;
            document.onmousemove = null;
            bg.style.cursor = "context-menu";
        }
    }

    function initDragAndDrop() {
        if (!bg) return;

        const prevents = (event) => {
            event.preventDefault();

            if (event.type === "dragenter" || event.type === "dragover") bg.classList.add("bg-neutral/30");
            if (event.type === "dragleave" || event.type === "drop") bg.classList.remove("bg-neutral/30");

            if (event.type === "drop") {
                let pos = {
                    x: event.clientX - app.data.pos.x,
                    y: event.clientY - app.data.pos.y
                }

                const dataTransfer = event.dataTransfer;
                const files = [...dataTransfer.files];
                const data = dataTransfer.getData("text/plain");

                files.forEach(file => {
                    if (file.type.startsWith("image/")) {
                        addImage(file, pos);
                    }
                    if (file.type.startsWith("video/")) {
                        addVideo(file, pos);
                    }
                })

                if (data && data === "note") {
                    addNote({}, pos);
                }
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

    function initBack() {
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "z") {
                event.preventDefault();
                if (lastAppStates.length > 1) {
                    lastAppStates.pop();
                    app.data = {...lastAppStates[lastAppStates.length - 1].data};
                }
            }
        })
    }

    onMount(async () => {
        if (!app) await goto("/app");
        if (!bg) return;

        initDragAndDrop();
        updateApps();

        bg.onmousedown = (event) => {
            event.preventDefault();
            if (event.target === bg) drag(event)
        };
        bg.onclick = (event) => {
            if (event.target === bg) document.activeElement.blur();
        }
        bg.oncontextmenu = (event) => {
            event.preventDefault();
        }

        initSave();
        initZoom();
        initBack();
        addState();

        document.body.style.overflow = "hidden";

        appContainer.style.left = `${app.data.pos.x}px`;
        appContainer.style.top = `${app.data.pos.y}px`;
    });
</script>

<div>
    <div class="bg-pattern w-screen h-screen absolute" bind:this={bgPattern}></div>
    <div class="absolute w-screen h-screen duration-200" bind:this={bg}></div>
    <div class="absolute" bind:this={appContainer}>
        {#if app}
            {#each app.data.components as component}
                {#if component.type === "note"}
                    <Note app={app} path={path+component.uuid+"/"} addState={addState}/>
                {:else if component.type === "image"}
                    <Image app={app} path={path+component.uuid+"/"} addState={addState}/>
                {:else if component.type === "video"}
                    <Video app={app} path={path+component.uuid+"/"} addState={addState}/>
                {/if}
            {/each}
        {/if}
    </div>
    <AppSideBar addContainer={addContainer} addNote={addNote}/>
    <p class="fixed left-5 bottom-5 text-white/30">Last save: {saveAgo} seconds ago</p>
</div>

<style>
    .bg-pattern {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
    }
</style>