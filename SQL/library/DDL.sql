-- ----------------------------
--          db_info
-- ----------------------------
DROP TABLE IF EXISTS 'db_info';
CREATE TABLE 'db_info'
(
    'name'  TEXT PRIMARY KEY,
    'value' TEXT NOT NULL
);
INSERT INTO 'db_info'
VALUES ('version', '1');


-- ----------------------------
--          record
-- ----------------------------
DROP TABLE IF EXISTS 'record';
CREATE TABLE 'record'
(
    'id'               INTEGER PRIMARY KEY AUTOINCREMENT,               -- 主键
    'title'            VARCHAR(255)                           NOT NULL, -- 标题
    'translated_title' VARCHAR(255) DEFAULT ''                NOT NULL, -- 翻译后的标题
    'rate'             TINYINT      DEFAULT 0                 NOT NULL, -- 等级评分，1~5
    'hyperlink'        TEXT         DEFAULT NULL              NULL,     -- 在浏览器打开的url，长度控制在2000个字符以内
    'release_date'     DATE         DEFAULT NULL              NULL,     -- 发布日期

    'dirname_id'       INTEGER      DEFAULT 0                 NOT NULL, -- 所在目录的id
    'basename'         TEXT         DEFAULT NULL              NULL,     -- 文件名

    'recycled'         BOOLEAN      DEFAULT 0                 NOT NULL, -- 是否放入回收站,0 false,1 true
    'info_status'      VARCHAR(3)   DEFAULT '000'             NOT NULL, -- 表示hyperlink、basename、cover三个字段是否为空，0 空 1 不为空
    'tag_author_sum'   TEXT         DEFAULT NULL              NULL,     -- 用于快速查询的冗余字段
    'search_text'      TEXT         DEFAULT ''                NOT NULL, -- 不想显示但是需要被搜索命中的文本

    'gmt_create'       DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 创建时间 utc
    'gmt_modified'     DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL  -- 修改时间  utc
);
CREATE INDEX 'idx_record(rate)' ON record (rate);
CREATE INDEX 'idx_record(info_status)' ON record (info_status);
CREATE INDEX 'idx_record(recycled)' ON record (recycled);
CREATE INDEX 'idx_record(dirname_id)' ON record (dirname_id);
CREATE INDEX 'idx_record(release_date)' ON record (release_date);
CREATE UNIQUE INDEX 'uk_record(dirname_id, basename)' ON record (dirname_id, basename);
-- 1. 为什么要添加info_status字段？
-- 业务有筛选cover，hyperlink，basename是否为空的功能，如果给这三个字段直接添加索引，让‘’表示为空，但是sqlite3没有前缀索引。
-- 这使得索引的离散度很高，占用的空间也大，所以不适合直接添加索引。
-- 所以我添加了一个info_status字段，用来表示cover，hyperlink，basename这三个字段是否为空，0 空,1 不为空。
-- 给info_status添加索引，值只有2^3=8种可能，离散度很低，占用的空间也小，适合添加索引。
-- 渲染进程发送也是由0和1组成的字符串，只是0代表不筛选，1代表筛选，0表示可以是空(0)也可以是非空(1)，1表示必须是非空(1)。
-- 比如，001表示必须要有basename,其他随意，符合的info_status值有001，011，101，111，这四种情况。


-- ----------------------------
--         record_extra
-- ----------------------------
DROP TABLE IF EXISTS 'record_extra';
CREATE TABLE 'record_extra'
(
    'id'      INTEGER PRIMARY KEY,      -- 主键(与record主键一一对应)
    'plot'    TEXT DEFAULT '' NOT NULL, -- 剧情
    'reviews' TEXT DEFAULT '' NOT NULL, -- 点评
    'info'    TEXT DEFAULT '' NOT NULL  -- 额外信息
);
-- info 字段用于保存，对记录内容无关的信息.比如备份的位置,备份的时间等等。


-- ----------------------------
--         dirname
-- ----------------------------
DROP TABLE IF EXISTS 'dirname';
CREATE TABLE 'dirname'
(
    'id'   INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'path' TEXT NOT NULL                      -- 保存在的目录
);
CREATE UNIQUE INDEX 'uk_dirname(path)' ON dirname (path);


-- ----------------------------
--         author
-- ----------------------------
DROP TABLE IF EXISTS 'author';
CREATE TABLE 'author'
(
    'id'           INTEGER PRIMARY KEY AUTOINCREMENT,           -- 主键
    'name'         VARCHAR(255)                       NOT NULL, -- 作者的名字
    'intro'        TEXT     DEFAULT ''                NOT NULL, -- 作者的介绍
    'gmt_create'   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 创建时间
    'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL  -- 最近一次修改时间
);
CREATE UNIQUE INDEX 'uk_author(name)' ON author (name);


-- ----------------------------
--        record_author
-- ----------------------------
DROP TABLE IF EXISTS 'role';
CREATE TABLE 'role'
(
    'id'   INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(50) NOT NULL
);
CREATE UNIQUE INDEX 'uk_role(name)' ON role (name);


-- ----------------------------
--        record_author
-- ----------------------------
DROP TABLE IF EXISTS 'record_author';
CREATE TABLE 'record_author'
(
    'id'        INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'record_id' INTEGER           NOT NULL,        -- 记录id
    'author_id' INTEGER           NOT NULL,        -- 作者id
    'role_id'   INTEGER DEFAULT 0 NOT NULL         -- 角色id
);
CREATE INDEX 'idx_record_author(record_id)' ON record_author (record_id);
CREATE INDEX 'idx_record_author(author_id)' ON record_author (author_id);
CREATE INDEX 'idx_record_author(role_id)' ON record_author (role_id); -- 根据role 来分类作者
CREATE UNIQUE INDEX 'uk_record_author(record_id,author_id,role_id)' ON record_author (record_id, author_id, role_id);


-- ----------------------------
--           tag
-- ----------------------------
DROP TABLE IF EXISTS 'tag';
CREATE TABLE 'tag'
(
    'id'    INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'title' VARCHAR(255) NOT NULL              -- 标签的标题
);
CREATE UNIQUE INDEX 'uk_tag(title)' ON tag (title);


-- ----------------------------
--        record_tag
-- ----------------------------
DROP TABLE IF EXISTS 'record_tag';
CREATE TABLE 'record_tag'
(
    'id'        INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'record_id' INTEGER NOT NULL,                  -- 记录的id
    'tag_id'    INTEGER NOT NULL                   -- tag的id
);
CREATE INDEX 'idx_record_tag(record_id)' ON record_tag (record_id);
CREATE INDEX 'idx_record_tag(tag_id)' ON record_tag (tag_id);
CREATE UNIQUE INDEX 'uk_record_tag(record_id,tag_id)' ON record_tag (record_id, tag_id);


-- ----------------------------
--        series
-- ----------------------------
DROP TABLE IF EXISTS 'series';
CREATE TABLE 'series'
(
    'id'   INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'name' VARCHAR(255) NOT NULL              -- 系列名
);
CREATE UNIQUE INDEX 'uk_series(name)' ON series (name);


-- ----------------------------
--        record_series
-- ----------------------------
DROP TABLE IF EXISTS 'record_series';
CREATE TABLE 'record_series'
(
    'id'        INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
    'record_id' INTEGER NOT NULL,                  -- 记录id
    'series_id' INTEGER NOT NULL                   -- 系列id
);
CREATE INDEX 'idx_record_series(record_id)' ON record_series (record_id);
CREATE INDEX 'idx_record_series(series_id)' ON record_series (series_id);
CREATE UNIQUE INDEX 'uk_record_series(record_id,series_id)' ON record_series (record_id, series_id);