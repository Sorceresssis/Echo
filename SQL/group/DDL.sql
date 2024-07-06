DROP TABLE IF EXISTS 'db_info';
CREATE TABLE 'db_info'
(
    'name'  TEXT PRIMARY KEY,
    'value' TEXT NOT NULL
);
INSERT INTO 'db_info'
VALUES ('version', '1');

DROP TABLE IF EXISTS 'group';
CREATE TABLE 'group'
(
    'id'           INTEGER PRIMARY KEY AUTOINCREMENT,           -- 主键
    'name'         VARCHAR(255)                       NOT NULL, -- 组的名字
    'prev_id'      INTEGER  DEFAULT 0                 NOT NULL, -- 上一条记录
    'next_id'      INTEGER  DEFAULT 0                 NOT NULL, -- 下一条记录
    'gmt_create'   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
    'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL  -- 最近一次修改时间
);
CREATE INDEX 'idx_group(prev_id)' ON 'group' (prev_id);
CREATE INDEX 'idx_group(next_id)' ON 'group' (next_id);


DROP TABLE IF EXISTS 'library';
CREATE TABLE 'library'
(
    'id'           INTEGER PRIMARY KEY AUTOINCREMENT,           -- 主键
    'name'         VARCHAR(255)                       NOT NULL, -- 库的名字
    'prev_id'      INTEGER  DEFAULT 0                 NOT NULL, -- 上一条记录
    'next_id'      INTEGER  DEFAULT 0                 NOT NULL, -- 下一条记录
    'gmt_create'   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
    'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 最近一次修改时间
    'group_id'     INTEGER                            NOT NULL  -- 所属的组
);
CREATE INDEX 'idx_library(prev_id)' ON library (prev_id);
CREATE INDEX 'idx_library(next_id)' ON library (next_id);
CREATE INDEX 'idx_library(group_id)' ON library (group_id);


-- library_extra
DROP TABLE IF EXISTS 'library_extra';
CREATE TABLE 'library_extra'
(
    'id'               INTEGER                 NOT NULL, -- 外键
    'auxiliary_st'     VARCHAR(255) DEFAULT '' NOT NULL, -- 辅助搜索文本
    'use_auxiliary_st' BOOLEAN      DEFAULT 1  NOT NULL, -- 使用辅助搜索文本
    'intro'            TEXT         DEFAULT '' NOT NULL  -- 介绍
);
CREATE INDEX 'idx_library_extra(id)' ON library_extra (id);
