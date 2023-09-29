import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import DynamicSqlBuilder from "../util/DynamicSqlBuilder"

export type QueryTagsSortRule = {
    field: 'title' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class TagDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryTagsByRecordId(recordId: PrimaryKey) {
        return this.lib.dbConnection.all('SELECT t.id, t.title FROM tag t JOIN record_tag rt ON t.id = rt.tag_id WHERE rt.record_id = ?;', recordId)
    }

    public queryTagsByKeyword(
        keyword: string,
        sort: QueryTagsSortRule[],
        offset: number,
        rowCount: number
    ) {
        const sql = new DynamicSqlBuilder()

        if (keyword !== '') {
            this.lib.dbConnection.registerSQLFnRegexp(keyword)

        }
        return {

        }
    }

    public updateTagTitle(id: PrimaryKey, title: string): number {
        return this.lib.dbConnection.run("UPDATE tag SET title = ? WHERE id = ?;", title, id).changes
    }

    public insertTag(title: string): PrimaryKey {
        return this.lib.dbConnection.run("INSERT INTO tag(title) VALUES(?);", title).lastInsertRowid
    }

    public deleteTagById(id: PrimaryKey): number {
        return this.lib.dbConnection.run("DELETE FROM tag WHERE id = ?;", id).changes
    }
}


export default TagDao