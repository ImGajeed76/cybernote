import {writable} from "svelte/store";

export type App = {
    uuid: string | undefined,
    data: any | undefined,
    name: string,
    description: string,
}

export const apps = writable<App[]>([]);

export function create(app: App) {
    if (!app.uuid) app.uuid = Math.random().toString(36).substr(2, 9);
    if (!app.data) app.data = {
        pos: {
            x: 0,
            y: 0,
        },
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

create({
    uuid: "test",
    name: "App 1",
    description: "Congrats, here is your first app!",
    data: {
        pos: {
            x: 0,
            y: 0,
        },
        title: "main",
        type: "container",
        components: [
            {
                pos: {
                    x: 0,
                    y: 0,
                },
                type: "note",
                content: "This is a note",
            }
        ]
    }
})