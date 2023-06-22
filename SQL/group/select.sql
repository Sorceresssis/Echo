-- 按顺序查询所有分组
WITH RECURSIVE group_list AS (
	SELECT * FROM 'group' WHERE prev_id = 0
	UNION ALL
	SELECT g.* FROM 'group' g JOIN group_list gl ON g.id = gl.next_id WHERE gl.next_id != 0
)
SELECT id, name, is_hide FROM group_list;

-- 按顺序查询分组下的库
WITH RECURSIVE library_list AS (
	SELECT * FROM 'library' WHERE group_id = 1 AND prev_id = 0
	UNION ALL
	SELECT l.* FROM 'library' l JOIN library_list ll ON l.id = ll.next_id WHERE l.group_id = 1 AND ll.next_id != 0
)
SELECT id, name, is_hide FROM library_list;