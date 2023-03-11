<script>
    import {onMount} from "svelte";

    export let component;
    export let app;

    let div;
    let left;
    let top;

    function updatePosition() {
        left = component.pos.x - app.data.pos.x + (window.screen.availWidth / 2) - (div.offsetWidth / 2);
        top = component.pos.y - app.data.pos.y + (window.screen.availHeight / 2) - (div.offsetHeight / 2);
        div.style.left = left + 'px';
        div.style.top = top + 'px';
    }

    function dragDiv(event) {
        event = event || window.event;
        event.preventDefault();

        let offsetLeft = (event.clientX - left) - (div.offsetWidth / 2);
        let offsetTop = (event.clientY - top) - (div.offsetHeight / 2);

        div.onmousemove = (event) => {
            event = event || window.event;
            component.pos.x = event.clientX - offsetLeft - (window.screen.availWidth / 2);
            component.pos.y = event.clientY - offsetTop - (window.screen.availHeight / 2);
            updatePosition();
            div.style.cursor = 'grabbing';
        };
        document.onmouseup = () => {
            div.onmousemove = null;
            document.onmouseup = null;
            div.style.cursor = 'context-menu';
        }
    }

    onMount(() => {
        updatePosition();

        div.style.overflow = 'hidden';
        div.style.resize = 'none';
        div.onmousedown = (event) => {
            if (div !== document.activeElement) {
                dragDiv(event);
            }
        };
        div.ondblclick = () => {
            div.style.cursor = 'text';
            div.focus();
        }
        div.onmouseenter = () => {
            if (div === document.activeElement) {
                div.style.cursor = 'text';
            } else {
                div.style.cursor = 'context-menu';
            }
        }
        div.onmouseleave = () => {
            div.style.cursor = 'context-menu';
        }
    })
</script>

<textarea class="max-w-40 max-h-40 w-40 h-40 bg-neutral rounded shadow-2xl p-5 absolute" bind:this={div}>{component.content}</textarea>