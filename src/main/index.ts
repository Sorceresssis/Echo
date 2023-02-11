// index.ts
import { app } from "electron";
import { createWindow } from "./main-window";


async function bootstrap() {
    app.on("ready", () => {
        const window = createWindow();
    });
}

bootstrap();
