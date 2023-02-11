// index.ts
import { contextBridge, ipcRenderer } from "electron";
const sayHello = () => {
    console.log("hello");
};

const apis = {
    sayHello: sayHello
};

export type Apis = typeof apis;

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
contextBridge.exposeInMainWorld("Main", apis);
