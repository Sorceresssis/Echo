DROP TABLE IF EXISTS 'group';
CREATE TABLE 'group'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'name' VARCHAR(255) NOT NULL, -- 组的名字
'prev_id' INTEGER DEFAULT 0 NOT NULL, -- 上一条记录
'next_id' INTEGER DEFAULT 0 NOT NULL, -- 下一条记录
'is_hide' BOOLEAN DEFAULT 0 NOT NULL,
'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL -- 最近一次修改时间
);
CREATE INDEX 'idx_group(prev_id)' ON 'group'(prev_id);
CREATE INDEX 'idx_group(next_id)' ON 'group'(next_id);


DROP TABLE IF EXISTS 'library';
CREATE TABLE 'library'(
'id' INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键
'name' VARCHAR(255) NOT NULL, -- 库的名字
'prev_id' INTEGER DEFAULT 0 NOT NULL, -- 上一条记录
'next_id' INTEGER DEFAULT 0 NOT NULL, -- 下一条记录
'is_hide' BOOLEAN DEFAULT 0 NOT NULL, -- 是否隐藏
'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,-- 创建时间
'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 最近一次修改时间
'group_id' INTEGER NOT NULL -- 所属的组
);
CREATE INDEX 'idx_library(prev_id)' ON library(prev_id);
CREATE INDEX 'idx_library(next_id)' ON library(next_id);
CREATE INDEX 'idx_library(group_id)' ON library(group_id);


-- library_extra
DROP TABLE IF EXISTS 'library_extra';
CREATE TABLE 'library_extra'(
'id' INTEGER NOT NULL, -- 外键
'keyword' VARCHAR(255) DEFAULT '' NOT NULL, -- 关键词
'intro' TEXT DEFAULT '' NOT NULL -- 介绍
);
CREATE INDEX 'idx_library_extra(id)' ON library_extra(id);


-- VIEW
CREATE VIEW v_libraryDetail AS
SELECT
    l.id,
    l.name,
    l.prev_id,
    l.next_id,
    l.is_hide,
    le.keyword,
    le.intro,
    l.gmt_create,
    l.gmt_modified,
    l.group_id 
FROM
	library l
	LEFT JOIN library_extra le ON l.id = le.id;



-- Trigger
DROP TRIGGER IF EXISTS del_libraryExtra;
CREATE TRIGGER del_libraryExtra
AFTER DELETE ON library
FOR EACH ROW
BEGIN
	DELETE FROM library_extra WHERE id = OLD.id;
END;

DROP TRIGGER IF EXISTS ins_libraryExtra;
CREATE TRIGGER ins_libraryExtra
AFTER INSERT ON library
FOR EACH ROW
BEGIN
	INSERT INTO library_extra(id, keyword, intro)VALUES(NEW.id, '', '');
END;