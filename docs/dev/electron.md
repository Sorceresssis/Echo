# Electron

## Better-sqlite3

### 注意事项

1. Select 字句的字段名不能用 `''` 包裹
2. get()空结果为 undefined 不是 null

### 编译

better-sqlite3 是 Node.js 包，不是 Electron 包。所以需要使用 [@electron/rebuild](https://github.com/electron/rebuild) 来编译成 Electron 可以使用的包。

> **注意**
>
> 原来的 electron-rebuild 已经弃用。现在由 @electron/rebuild 代替

安装依赖

```powershell
# 安装依赖
# @electron/rebuild 依赖 node-gyp
npm install -g node-gyp
npm install --save-dev @electron/rebuild
```

windows 终端直接编译

```powershell
node_modules/.bin/electron-rebuild -f -w better-sqlite3
```

可以可以用 npm 编译
先再 package.json 中添加

```json
"scripts": {
  "rebuild": "electron-rebuild -f -w yourmodule"
}
```

然后再终端运行

```powershell
npm run rebuild
```

## 路径处理

### 路径保存

保存的路径要统一去除最外的分隔符

```powershell
# 正确
C:\
C:\bar\foor

# 错误
C:.
C:\bar\boor\
```

### node:path 的 resolve, join, normalize

#### windows 盘符

```js
const p1 = "C";
const p2 = "C:";
const p3 = "C:.";
const p4 = "C:\\";

// resolve
// ${__dirname}\C
// C:\
// C:\
// C:\

// join 、normalize
// C
// C:.
// C:.
// C:\
```

#### 最外层分隔符

> C:\
>
> C:\user\
>
> C:\user

path.resolve() 不会保留最外部的分隔符

path.normalize() 会保留最外的分隔符

#### 结论

对要保存的路径做 resolve 处理, 因为盘符处理是一致的，路径统一去除最外的分隔符

对路径截取操作适合使用 normlize，对分隔符的保留使得路径比对更方便。
