-- ORDER BY
CREATE INDEX item__clicks_INDEX ON item(clicks);


-- WHERE
CREATE INDEX item__hyperlink_INDEX ON item(hyperlink);
CREATE INDEX item__hasImage_INDEX ON item(hasImage);
CREATE INDEX item__folder_id_INDEX ON item(folder_id);


-- JOIN
CREATE INDEX item_detail__id_INDEX ON item_detail(id);

CREATE INDEX item_author__item_id_INDEX ON item_author(item_id);
CREATE INDEX item_author__author_id_INDEX ON item_author(author_id);

CREATE INDEX item_tag__item_id_INDEX ON item_tag(item_id);
CREATE INDEX item_tag__tag_id_INDEX ON item_tag(tag_id);

CREATE INDEX item_series__item_id_INDEX ON item_series(item_id);
CREATE INDEX item_series__series_id_INDEX ON item_series(series_id);