-- item
CREATE TABLE item(
-- item的主键
id INTEGER PRIMARY KEY AUTOINCREMENT,
-- item的标题
title VARCHAR(255) NOT NULL,
-- item的创建时间
createTime DATETIME NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
-- 点击数
clicks INT DEFAULT 0,
-- 有图片
hasImage BOOLEAN DEFAULT 0,
-- 是喜爱
isFav BOOLEAN DEFAULT 0,
-- item的超链接，网页打开
hyperlink TEXT,
-- 文件所在的文件夹
folder_id INTEGER
);

-- item_detail
CREATE TABLE item_detail(
-- item的主键
id INTEGER NOT NULL,
-- item的文件名，本地打开
flieName TEXT,
-- item的介绍
intro TEXT,
-- 保存这item的信息 eg:
-- 本地备份：	硬盘编号-01，路径-video/xxxx/
-- 本地备份：	硬盘编号-03，路径-video/xxxx/
-- 云备份：		云服务-百度网盘，账号-xxx，路径-video/xxx/
info TEXT
);

-- folder
CREATE TABLE folder(
-- 文件夹id
id INTEGER PRIMARY KEY AUTOINCREMENT,
-- 文件夹的路径
path TEXT NOT NULL UNIQUE
);

-- Tag
CREATE TABLE tag(
-- tag的id
id INTEGER PRIMARY KEY AUTOINCREMENT,
-- tag的标题
title VARCHAR(255) NOT NULL UNIQUE
);

-- item_tag
CREATE TABLE item_tag(
item_id INTEGER NOT NULL,
tag_id INTEGER NOT NULL,
UNIQUE(item_id, tag_id)
);

-- author
CREATE TABLE author(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name VARCHAR(255) NOT NULL,
intro TEXT
);

-- item_author
CREATE TABLE item_author(
item_id INTEGER NOT NULL,
author_id INTEGER NOT NULL,
UNIQUE(item_id, author_id)
);

-- series
CREATE TABLE series(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name VARCHAR(255) NOT NULL
);

-- item_series
CREATE TABLE item_series(
item_id INTEGER NOT NULL,
series_id INTEGER NOT NULL,
UNIQUE(item_id, series_id)
);