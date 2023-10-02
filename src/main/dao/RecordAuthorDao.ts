import { injectable, inject } from "inversify"
import DI_TYPES, {type DILibrary } from "../DI/DITypes"

@injectable()
class RecordAuthorDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryCountOfRecordsByAuthorId(authorId: number): number {
        const sql = "SELECT COUNT(record_id) FROM record_author WHERE author_id = ?;"
        return this.lib.dbConnection.prepare(sql).pluck().get(authorId) as number
    }

    public queryRecordIdsByAuthorId(authorId: PrimaryKey, offset: number, rowCount: number): number[] {
        const sql = "SELECT record_id FROM record_author WHERE author_id = ? LIMIT ?,?;"
        return this.lib.dbConnection.prepare(sql).pluck().all(authorId, offset, rowCount) as number[]
    }

    public insertRecordAuthorByRecordIdAuthorIds(recordId: PrimaryKey, authorIds: PrimaryKey[]): void {
        const stmt = this.lib.dbConnection.prepare("INSERT INTO record_author(record_id, author_id) VALUES(?,?);")
        authorIds.forEach(authorId => stmt.run(recordId, authorId))
    }

    public deleteRecordAuthorByRecordIdAuthorIds(recordId: PrimaryKey, authorIds: PrimaryKey[]): void {
        const stmt = this.lib.dbConnection.prepare("DELETE FROM record_author WHERE record_id = ? AND author_id = ?;")
        authorIds.forEach(authorId => stmt.run(recordId, authorId))
    }

    public deleteRecordAuthorByAuthorId(authorId: PrimaryKey): number {
        return this.lib.dbConnection.run("DELETE FROM record_author WHERE author_id = ?;", authorId).changes
    }

    public deleteRecordAuthorByRecordId(recordId: PrimaryKey): number {
        return this.lib.dbConnection.run("DELETE FROM record_author WHERE record_id = ?;", recordId).changes
    }
}


export default RecordAuthorDao