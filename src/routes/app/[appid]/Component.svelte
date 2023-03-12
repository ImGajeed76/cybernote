<script lang="ts">
    import type {App} from "../../../store";
    import {onMount} from "svelte";

    export let path: string;
    export let app: App;

    export let focus: () => void = () => {
        div.focus();
    };

    let component;

    let div;
    let resize;

    let left = 0;
    let top = 0;

    let width = 0;
    let height = 0;

    let lastPos = {x: -1, y: -1};
    let lastSize = {width: -1, height: -1};

    let lastAppPos = {x: -1, y: -1};
    let lastAppSize = {width: -1, height: -1};

    function getComponent() {
        component = app.data;
        if (!path) return;
        const splitPath = path.split("/");
        splitPath.pop();
        for (let i = 0, len = splitPath.length; i < len; i++) {
            if ("components" in component && component.components) {
                component = component.components.find((component) => component.uuid === splitPath[i]);
            }
        }
    }

    function setSize(size: { width: number, height: number }) {
        if (size.width === lastSize.width && size.height === lastSize.height &&
            app.data.size.width === lastAppSize.width && app.data.size.height === lastAppSize.height) return;

        width = size.width;
        height = size.height;

        width *= app.data.size.width / 100;
        height *= app.data.size.width / 100;

        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        lastSize = {width: size.width, height: size.height};
    }

    function setPos(pos: { x: number, y: number }) {
        if (pos.x === lastPos.x && pos.y === lastPos.y &&
            app.data.pos.x === lastAppPos.x && app.data.pos.y === lastAppPos.y &&
            app.data.size.width === lastAppSize.width && app.data.size.height === lastAppSize.height) return;

        left = pos.x + (window.screen.availWidth / 2 * (app.data.size.width / 100)) - (div.offsetWidth / 2);
        top = pos.y + (window.screen.availHeight / 2 * (app.data.size.width / 100)) - (div.offsetHeight / 2);

        if (component.title !== "main") {
            left += app.data.pos.x;
            top += app.data.pos.y;
        }

        div.style.left = `${left}px`;
        div.style.top = `${top}px`;

        lastPos = {x: pos.x, y: pos.y};
        lastAppPos = {x: app.data.pos.x, y: app.data.pos.y};
    }

    function updateComponent() {
        if (!div) return;
        setPos(component.pos);
        setSize(component.size);
        lastAppSize = {width: app.data.size.width, height: app.data.size.height};
    }

    function drag(event) {
        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;

        const divStartX = component.pos.x;
        const divStartY = component.pos.y;

        document.onmousemove = (event) => {
            component.pos.x = (divStartX + event.clientX - startX);
            component.pos.y = (divStartY + event.clientY - startY);
            div.style.cursor = 'grabbing';
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            div.style.cursor = 'context-menu';
        };
    }

    function resizeDiv(event) {
        event.preventDefault();

        let startX = event.clientX;
        let startY = event.clientY;

        let divStartWidth = component.size.width;
        let divStartHeight = component.size.height;

        let divStartX = component.pos.x;
        let divStartY = component.pos.y;

        document.onmousemove = (event) => {
            component.size.width = divStartWidth + event.clientX - startX;
            component.size.height = divStartHeight + event.clientY - startY;
            component.pos.x = divStartX + (event.clientX - startX) / 2;
            component.pos.y = divStartY + (event.clientY - startY) / 2;
            div.style.cursor = 'nwse-resize';
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            div.style.cursor = 'context-menu';
        };
    }

    function autoUpdate() {
        updateComponent();
        setTimeout(() => requestAnimationFrame(() => autoUpdate()), 1000 / 60)
    }

    function deleteComponent() {
        component = app.data;
        if (!path) return;
        const splitPath = path.split("/");
        splitPath.pop();
        for (let i = 0, len = splitPath.length - 1; i < len; i++) {
            if ("components" in component && component.components) {
                component = component.components.find((component) => component.uuid === splitPath[i]);
            }
        }
        component.components = component.components.filter((component) => component.uuid !== splitPath[splitPath.length - 1]);
    }

    function initMouse() {
        div.onmousedown = (event) => {
            if (
                div !== document.activeElement &&
                !div.contains(document.activeElement) &&
                !resize.contains(event.target)
            ) {
                drag(event)
            }
        };
        div.onclick = () => {
            div.focus();
        };
        div.ondblclick = () => {
            focus()
        };
        div.onmouseenter = () => {
            if (div !== document.activeElement && !div.contains(document.activeElement)) {
                div.style.cursor = "context-menu";
            }
        };
        div.onmouseleave = () => {
            div.style.cursor = 'context-menu';
        };

        resize.onmouseenter = () => {
            div.style.cursor = "nwse-resize";
        };
        resize.onmouseleave = () => {
            div.style.cursor = 'context-menu';
        };
        resize.onmousedown = (event) => {
            if (div !== document.activeElement && !div.contains(document.activeElement)) resizeDiv(event)
        }

        div.addEventListener("keydown", (event) => {
            if (event.key === "Delete" && div === document.activeElement) {
                deleteComponent();
            }
        })
    }

    onMount(() => {
        getComponent();
        updateComponent();
        autoUpdate();

        initMouse();
    })
</script>

<div bind:this={div}
     class="bg-neutral absolute shadow-2xl outline outline-0 outline-white focus:outline-1 rounded duration-200"
     tabindex="0">
    <slot/>
    <div class="absolute w-[20px] h-[20px] bottom-0 right-0" bind:this={resize}>
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M10 20L20 20L20 10" stroke="#2A303C" stroke-width="2"></path>
                <path d="M12 17L17 17L17 12" stroke="#2A303C" stroke-width="2"></path>
            </g>
        </svg>
    </div>
</div>