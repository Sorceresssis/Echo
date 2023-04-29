-- type item tag author folder
'item' AS type
'tag' AS type
'author' AS type
'folder' AS type


SELECT type, id, value FROM (
	-- item_title
	SELECT 'item' AS type, id, title AS value,
		(CASE WHEN UPPER(title) LIKE UPPER('%a%') THEN 1 ELSE 0 END +
		CASE WHEN UPPER(title) LIKE UPPER('%b%') THEN 1 ELSE 0 END) AS sore
	FROM item WHERE sore > 0 UNION ALL
	-- author
	SELECT 'author' AS type, id, name AS value,
		(CASE WHEN UPPER(name) LIKE UPPER('%a%') THEN 1 ELSE 0 END +
		CASE WHEN UPPER(name) LIKE UPPER('%b%') THEN 1 ELSE 0 END) AS sore
	FROM author WHERE sore > 0 UNION ALL
	-- tag
	SELECT 'tag' AS type, id, title AS value,
		(CASE WHEN UPPER(title) LIKE UPPER('%a%') THEN 1 ELSE 0 END +
		CASE WHEN UPPER(title) LIKE UPPER('%b%') THEN 1 ELSE 0 END) AS sore
	FROM tag WHERE sore > 0 UNION ALL
	-- folder
	SELECT 'folder' AS type, id, path AS value, (
		CASE WHEN UPPER(path) LIKE UPPER('%a%') THEN 1 ELSE 0 END +
		CASE WHEN UPPER(path) LIKE UPPER('%b%') THEN 1 ELSE 0 END
	) AS sore FROM folder WHERE sore > 0
) ORDER BY sore DESC LIMIT 0, 20;