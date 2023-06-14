-- ----------------------------
--          record
-- ----------------------------
DROP TABLE IF EXISTS 'record';
CREATE TABLE 'record'( 
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'title' VARCHAR(255) NOT NULL, -- 记录标题
'rate' TINYINT DEFAULT 0 NOT NULL, -- 等级评分，1~5
'hasCoverImage' BOOLEAN DEFAULT 0 NOT NULL, -- 是否有封面,0没有,1有
'hyperlink' TEXT DEFAULT '' NOT NULL, -- 在浏览器打开的url，长度控制在2000个字符以内
'is_recycled' BOOLEAN DEFAULT 0 NOT NULL, -- 是否放入回收站,0 false,1 true
'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 最近一次修改时间
'dirname_id' INTEGER DEFAULT 0 NOT NULL -- 所在目录的id
);
CREATE INDEX 'idx_record(rate)' ON record(rate); -- order
CREATE INDEX 'idx_record(dirname_id)' ON record(dirname_id); -- join
CREATE INDEX 'idx_record(hasCoverImage)' ON record(hasCoverImage); -- filter

-- ----------------------------
--         record_extra
-- ----------------------------
DROP TABLE IF EXISTS 'record_extra';
CREATE TABLE 'record_extra'(
'record_id' INTEGER PRIMARY KEY, -- 与record(id)对应
'basename' TEXT DEFAULT '' NOT NULL, -- 文件名
'intro' TEXT DEFAULT '' NOT NULL, -- 介绍、简介
'info' TEXT DEFAULT '' NOT NULL-- 信息，eg: 1.本地备份：	硬盘编号-01，路径-video/xxxx/ 2.本地备份：	硬盘编号-03，路径-video/xxxx/ 3.云备份：		云服务-百度网盘，账号-xxx，路径-video/xxx/ 4.磁力链接
);  

-- ----------------------------
--         dirname
-- ----------------------------
DROP TABLE IF EXISTS 'dirname';
CREATE TABLE 'dirname'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'dirname' TEXT NOT NULL -- 保存再的目录
);
CREATE UNIQUE INDEX 'uk_dirname(dirname)' ON dirname(dirname);

-- ----------------------------
--         author
-- ----------------------------
DROP TABLE IF EXISTS 'author';
CREATE TABLE 'author'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'name' VARCHAR(255) NOT NULL, -- 作者的名字
'intro' TEXT DEFAULT '' NOT NULL, -- 作者的介绍
'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL -- 最近一次修改时间
);

-- ----------------------------
--        record_author
-- ----------------------------
DROP TABLE IF EXISTS 'record_author';
CREATE TABLE 'record_author'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'record_id' INTEGER NOT NULL, -- 记录的id
'author_id' INTEGER NOT NULL -- 作者的id
);
CREATE UNIQUE INDEX 'uk_record_author(record_id,author_id)' ON record_author(record_id, author_id);
CREATE INDEX 'idx_record_author(record_id)' ON record_author(record_id);
CREATE INDEX 'idx_record_author(author_id)' ON record_author(author_id);

-- ----------------------------
--        tag
-- ----------------------------
DROP TABLE IF EXISTS 'tag';
CREATE TABLE 'tag'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'tag' VARCHAR(255) NOT NULL --tag
);
CREATE UNIQUE INDEX 'uk_tag(tag)' ON tag(tag); -- 查询，unique。

-- ----------------------------
--        record_tag
-- ----------------------------
DROP TABLE IF EXISTS 'record_tag';
CREATE TABLE 'record_tag'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'record_id' INTEGER NOT NULL, -- 记录的id
'tag_id' INTEGER NOT NULL -- tag的id
);
CREATE UNIQUE INDEX 'uk_record_tag(record_id,tag_id)' ON record_tag(record_id,tag_id);
CREATE INDEX 'idx_record_tag(record_id)' ON record_tag(record_id);
CREATE INDEX 'idx_record_tag(tag_id)' ON record_tag(tag_id);

-- ----------------------------
--        series
-- ----------------------------
DROP TABLE IF EXISTS 'series';
CREATE TABLE 'series'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'name' VARCHAR(255) NOT NULL -- 系列名
);

-- ----------------------------
--        record_series
-- ----------------------------
DROP TABLE IF EXISTS 'record_series';
CREATE TABLE 'record_series'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'record_id' INTEGER NOT NULL, -- 记录id
'series_id' INTEGER NOT NULL -- 系列id
);
CREATE UNIQUE INDEX 'uk_record_series(record_id,series_id)' ON record_series(record_id,series_id);
CREATE INDEX 'idx_record_series(record_id)' ON record_series(record_id);
CREATE INDEX 'idx_record_series(series_id)' ON record_series(series_id);

