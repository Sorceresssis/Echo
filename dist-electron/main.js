"use strict";const{app:e,BrowserWindow:t}=require("electron");require("path");const o=()=>{const n=new t({width:800,height:600,webPreferences:{nodeIntegration:!0,contextIsolation:!1}});process.env.VITE_DEV_SERVER_URL?n.loadURL(process.env.VITE_DEV_SERVER_URL):n.loadFile("../index.html"),n.webContents.openDevTools()};e.whenReady().then(()=>{o(),e.on("activate",()=>{t.getAllWindows().length===0&&o()})});e.on("window-all-closed",()=>{process.platform!=="darwin"&&e.quit()});
