-- 没有搜索词
SELECT a.id, a.name, a.intro, COUNT(ia.item_id) AS itemCount, GROUP_CONCAT(ia.item_id) AS itemIDs
FROM author a JOIN item_author ia ON a.id = ia.author_id JOIN item i ON ia.item_id = i.id
WHERE i.hasImage = 1
GROUP BY a.id;

-- 有
SELECT a.id, a.name, a.intro, COUNT(ia.item_id) AS itemCount, GROUP_CONCAT(ia.item_id) AS itemIDs
FROM author a JOIN item_author ia ON a.id = ia.author_id JOIN item i ON ia.item_id = i.id
WHERE i.hasImage = 1
	AND ia.item_id IN (
	SELECT id FROM item WHERE
	UPPER(title) LIKE UPPER('%测试%') OR UPPER(title) LIKE UPPER('%a%') UNION ALL
	SELECT it.item_id FROM item_tag it JOIN tag t ON it.tag_id = t.id WHERE
	UPPER(t.title) LIKE UPPER('%u%') OR UPPER(t.title) LIKE UPPER('%鬼%') UNION ALL
	SELECT ia.item_id FROM item_author ia JOIN author a ON ia.author_id = a.id WHERE
	UPPER(a.name) LIKE UPPER('%u%') OR UPPER(a.name) LIKE UPPER('%鬼%')
	)
GROUP BY a.id;
