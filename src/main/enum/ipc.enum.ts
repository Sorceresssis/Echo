export const enum AutoCompleteType {
    TITLE = 0, TAG,
}

/*
-src\
    |- share\
        |- tsconfig.json
        |- enum\
            |- ipc.enum.ts
    |- main\
        |- tsconfig.json
        |- ipcMain\
            |- index.ts
 在这样的目录结构下，ipc.enum.ts引用了ipcMain下的index.ts文件，使编译结果出现了错误
 */