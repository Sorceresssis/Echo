-- 获取item的所有作者
CREATE VIEW allAuthorsOfItem_VIEW AS
SELECT
	ia.item_id,
	GROUP_CONCAT( a.id ) AS authorIDs,
	GROUP_CONCAT( a.name ) AS authorNames
FROM
	item_author ia
	JOIN author a ON ia.author_id = a.id
GROUP BY
	ia.item_id;

-- 用户的item选择列表
CREATE VIEW itemList_VIEW AS
SELECT
	i.*,
	aaoi_V.authorIDs,
	aaoi_V.authorNames,
	GROUP_CONCAT(DISTINCT t.title) AS tags
FROM
	item i
	-- author可以重名，所以要明确id，所以不可以像tag一样简单的去重
	LEFT JOIN allAuthorsOfItem_VIEW aaoi_V ON i.id = aaoi_V.item_id
	LEFT JOIN item_tag it ON i.id = it.item_id
	LEFT JOIN tag t ON it.tag_id = t.id
GROUP BY i.id;
