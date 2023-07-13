// ALL 不包含folder, series
const enum autoCompleteType { ITEM_TITLE = 0, AUTHOR_NAME, TAG_TITLE, FOLDER_PATH, SERIES_NAME, ALL }

const enum RecordLayout {
    THUMBNAIL = 1,
    EXTENDED,
    MINIMAL,
}


export { autoCompleteType, RecordLayout }