import {writable} from "svelte/store";

export interface App {
    uuid?: string,
    data: Component,
    name: string,
    description: string,
}

export interface Component {
    pos: {
        x: number,
        y: number,
        z?: number,
    },
    size: {
        width: number,
        height: number,
    },
    type: "container" | "note" | "image" | "video",
    uuid: string,
    title?: string,
    content?: string,
    components?: Component[],
    src?: string,
    deleted?: boolean,
}

export const apps = writable<App[]>([]);

export function create(app: App) {
    if (!app.uuid) app.uuid = Math.random().toString(36).substr(2, 9);
    if (!app.data) app.data = {
        pos: {
            x: 0,
            y: 0,
        },
        size: {
            width: 160,
            height: 160,
        },
        uuid: Math.random().toString(36).substr(2, 9),
        title: "main",
        type: "container",
        components: []
    };
    apps.update((apps) => [...apps, app]);
}

export function remove(uuid: string) {
    apps.update((apps) => apps.filter((app) => app.uuid !== uuid));
}

export function update(uuid: string, data: any) {
    apps.update((apps) => apps.map((app) => {
        if (app.uuid === uuid) {
            return {...app, data};
        }
        return app;
    }));
}