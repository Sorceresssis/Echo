# Echo 教程

## 设置语言和数据保存位置

如果 `数据保存位置`已经有数据了，Echo 会自动读取数据，如果没有数据会自动创建需要的数据

![1699727410446](image/index/1699727410446.png)

## 面板

![1699727757969](image/index/1699727757969.png)

## 管理数据

![1699727789007](image/index/1699727789007.png)

### 说明如何从文件夹导入数据

以下是从 `.metadata` 文件夹中导入数据的两种方式的说明：

#### 1. 导入单个文件夹中的数据

1. **检查路径** ：给定文件夹路径 `path/to/folder`。
2. **查找 .metadata 文件夹** ：检查路径下是否存在 `.metadata` 文件夹。
3. **导入数据** ：如果存在 `.metadata` 文件夹，则读取并导入其中的数据。

#### 2. 导入多个文件夹中的数据

1. **遍历文件夹** ：给定根文件夹路径 `path/to/root-folder`。
2. **检查子文件夹** ：遍历根文件夹下的所有子文件夹。
3. **重复单个文件夹操作** ：对于每个子文件夹，检查是否存在 `.metadata` 文件夹，若存在则读取并导入其中的数据。

### 示例代码说明

以下是实现上述逻辑的示例代码：

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>javascript</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>复制代码</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-javascript">const fs = require('fs');
const path = require('path');

// 导入单个文件夹中的数据
function importFromFolder(folderPath) {
    const metadataPath = path.join(folderPath, '.metadata');
    if (fs.existsSync(metadataPath)) {
        // 读取并导入数据的逻辑
        console.log(`导入 ${metadataPath} 中的数据`);
    } else {
        console.log(`文件夹 ${folderPath} 中没有 .metadata`);
    }
}

// 导入多个文件夹中的数据
function importFromMultipleFolders(rootFolderPath) {
    const folders = fs.readdirSync(rootFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(rootFolderPath, dirent.name));

    folders.forEach(importFromFolder);
}

// 示例用法
const singleFolderPath = 'path/to/folder';
importFromFolder(singleFolderPath);

const rootFolderPath = 'path/to/root-folder';
importFromMultipleFolders(rootFolderPath);
</code></div></div></pre>

### 结论

1. 对于单个文件夹，直接检查并导入 `.metadata` 文件夹中的数据。
2. 对于多个文件夹，遍历根文件夹下的所有子文件夹，重复单个文件夹的导入操作。

4o
