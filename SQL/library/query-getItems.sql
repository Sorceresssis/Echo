-- 搜索词			通用搜索: itemsQuery= ['a', 'b']; 高级搜索: itemsQueryTitle = ['a', 'b'], itemsQueryTag = ['c', 'd'], itemQueryAuthor = ['e', 'f']
-- 默认排序规则		没有搜索词的: id DESC, hits DESC, title标题字符串排序, 点击次数越多越靠前, 新添加的item靠前
-- 					有搜索词的: sumSore DESC, item_clicks DESC, item_title, item_id DESC 匹配度越高越靠前, 其他的不变
-- 数据懒加载		每次最多400条LIMIT的pagesize=300
-- item筛选			{hyperlink: false, folder_id: true, hasImage: false} false为不筛选


--------------------------------------------------------------- getItems
-- 无搜索词
SELECT il_V.* FROM
itemList_VIEW il_V
-- filter
WHERE il_V.folder_id IS NOT NULL AND il_V.hyperlink IS NOT NULL AND il_V.hasImage = 1
ORDER BY il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 通用搜索词
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%a%') OR UPPER(t.title) LIKE UPPER('%b%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%a%') OR UPPER(a.name) LIKE UPPER('%b%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
WHERE il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore DESC, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 高级搜索
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%c%') OR UPPER(t.title) LIKE UPPER('%d%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%e%') OR UPPER(a.name) LIKE UPPER('%f%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
WHERE il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;



--------------------------------------------------------------- getItemsByAuthor 作者id为2
-- 无搜索词
SELECT il_V.*
FROM
	itemList_VIEW il_V
	-- subquery to filter items by author_id
	JOIN (SELECT item_id FROM item_author WHERE author_id = 2) filterByAuthor ON il_V.id = filterByAuthor.item_id
WHERE il_V.folder_id IS NOT NULL
ORDER BY il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 通用搜索词
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%c%') OR UPPER(t.title) LIKE UPPER('%d%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%e%') OR UPPER(a.name) LIKE UPPER('%f%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
	-- subquery to filter items by author_id
	JOIN (SELECT item_id FROM item_author WHERE author_id = 2) filterByAuthor ON il_V.id = filterByAuthor.item_id
WHERE il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 高级搜索
SELECT t2.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT item_id, 1 AS sore FROM item
		WHERE UPPER(item_title) LIKE UPPER('%a%') OR UPPER(item_title) LIKE UPPER('%b%') UNION ALL
		SELECT t1.item_id, 0.5 AS sore FROM item_tag t1 JOIN tag t2 ON t1.tag_id = t2.tag_id
		WHERE UPPER(t2.tag_title) LIKE UPPER('%c%') OR UPPER(t2.tag_title) LIKE UPPER('%d%') UNION ALL
		SELECT t1.item_id, 0.5 AS sore FROM item_author t1 JOIN author t2 ON t1.author_id = t2.author_id
		WHERE UPPER(t2.author_name) LIKE UPPER('%e%') OR UPPER(t2.author_name) LIKE UPPER('%f%'))
	GROUP BY item_id) t1
	JOIN itemList_view t2 ON t1.item_id = t2.item_id
	JOIN (SELECT item_id FROM item_author WHERE author_id = 2) t3 ON t1.item_id = t3.item_id -- subquery to filter items by author_id
ORDER BY t1.sumSore DESC, t2.item_clicks DESC, t2.item_title, t2.item_id DESC
LIMIT 0, 300;



--------------------------------------------------------------- getItemsNoAuthor
-- 无搜索词
SELECT il_V.* FROM
itemList_VIEW il_V
-- WHERE il_V.authorIDs IS NULL
WHERE il_V.authorIDs IS NULL AND il_V.folder_id IS NOT NULL AND il_V.hyperlink IS NOT NULL AND il_V.hasImage = 1
ORDER BY il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 通用搜索词
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%a%') OR UPPER(t.title) LIKE UPPER('%b%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%a%') OR UPPER(a.name) LIKE UPPER('%b%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
-- WHERE il_V.authorIDs IS NULL
WHERE il_V.authorIDs IS NULL AND il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore DESC, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 高级搜索
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%c%') OR UPPER(t.title) LIKE UPPER('%d%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%e%') OR UPPER(a.name) LIKE UPPER('%f%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
-- WHERE il_V.authorIDs IS NULL
WHERE il_V.authorIDs IS NULL AND il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;



--------------------------------------------------------------- getItemsOfFav
-- 无搜索词
SELECT il_V.* FROM
itemList_VIEW il_V
-- il_V.isFav = 1
WHERE il_V.isFav = 1 AND il_V.folder_id IS NOT NULL AND il_V.hyperlink IS NOT NULL AND il_V.hasImage = 1
ORDER BY il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 通用搜索词
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%a%') OR UPPER(t.title) LIKE UPPER('%b%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%a%') OR UPPER(a.name) LIKE UPPER('%b%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
-- il_V.isFav = 1
WHERE il_V.isFav = 1 AND il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore DESC, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;

-- 高级搜索
SELECT il_V.*
FROM
	(SELECT item_id, SUM(sore) AS sumSore
	FROM
		(SELECT id AS item_id, 1 AS sore FROM item
		WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
		SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
		WHERE UPPER(t.title) LIKE UPPER('%c%') OR UPPER(t.title) LIKE UPPER('%d%') UNION ALL
		SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
		WHERE UPPER(a.name) LIKE UPPER('%e%') OR UPPER(a.name) LIKE UPPER('%f%'))
	GROUP BY item_id) matched
	JOIN itemList_view il_V ON matched.item_id = il_V.id
-- il_V.isFav = 1
WHERE il_V.isFav = 1 AND il_V.folder_id IS NOT NULL
ORDER BY matched.sumSore, il_V.id, il_V.hits DESC, il_V.title
LIMIT 0, 300;