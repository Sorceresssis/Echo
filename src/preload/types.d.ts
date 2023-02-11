// types.d.ts
import type { ipcRenderer } from "electron";
import type { Apis } from "./index";

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer;
        Main: Apis;
    }
}