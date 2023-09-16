-- ----------------------------
--  Query Record Recommended
-- ----------------------------
-- -- -- NO keyword
SELECT
	f.total_count,
	r.id, r.title, r.rate, r.hyperlink,
-- 	PATH_RESOLVE(?, r.cover) AS cover,
-- 	PATH_RESOLVE(d.path, r.basename) AS resourcePath,
	DATETIME(r.gmt_create, 'localtime')   AS createTime,
	DATETIME(r.gmt_modified, 'localtime') AS modifiedTime
FROM
	(	SELECT COUNT(r.id) OVER () AS total_count, r.id
		FROM record r
			LEFT JOIN record_author ra ON r.id = ra.record_id LEFT JOIN author a ON ra.author_id = a.id
		WHERE
			r.recycled = 0
			AND r.info_status IN ('001', '111', '011', '000')
			AND a.id = 1
		ORDER BY r.rate DESC, r.id DESC, r.title
		LIMIT 499950, 50) f
	JOIN record r ON f.id = r.id
	LEFT JOIN dirname d ON r.dirname_id = d.id

-- -- -- keyword
SELECT
	f.total_count,
	r.id, r.title, r.rate, r.hyperlink,
-- 	PATH_RESOLVE(?, r.cover) AS cover,
-- 	PATH_RESOLVE(d.path, r.basename) AS resourcePath,
	DATETIME(r.gmt_create, 'localtime')   AS createTime,
	DATETIME(r.gmt_modified, 'localtime') AS modifiedTime
FROM
	(	SELECT COUNT(r.id) OVER () AS total_count, r.id,  RANDOM() AS sore
		FROM record r
			JOIN record_author ra ON r.id = ra.record_id JOIN author a ON ra.author_id = a.id
		WHERE
			r.recycled = 0
			AND r.info_status IN ('001', '111', '011', '000')
			AND a.id = 1
			AND sore > 0.5
		ORDER BY sore DESC, r.rate DESC, r.id DESC, r.title
		LIMIT 499950, 50) f
	JOIN record r ON f.id = r.id
	LEFT JOIN dirname d ON r.dirname_id = d.id;
