import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"

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

    public queryRandomRecordIdsOfSameAuthorByRecordId(recordId: PrimaryKey, rowCount: number = 10): number[] {
        const sql = `
        SELECT ra2.record_id
        FROM record_author ra1 JOIN record_author ra2 ON ra1.author_id = ra2.author_id
        WHERE ra1.record_id = ? AND ra2.record_id != ?
        GROUP BY ra2.record_id
        ORDER BY RANDOM() LIMIT 0, ?`

        return this.lib.dbConnection.prepare(sql).pluck().all(recordId, recordId, rowCount) as number[]
    }

    public updateRoleByRecordIdAuthorId(recordId: PrimaryKey, authors: PO.AuthorIdAndRole[]): void {
        const stmt = this.lib.dbConnection.prepare("UPDATE record_author SET role = ? WHERE record_id = ? AND author_id = ?;")
        // 如果role为空，插入null，节省储存空间
        authors.forEach(author => stmt.run(author.role === '' ? null : author.role, recordId, author.id))
    }

    public insertRecordAuthorByRecordIdAuthorIds(recordId: PrimaryKey, authors: PO.AuthorIdAndRole[]): void {
        const stmt = this.lib.dbConnection.prepare("INSERT INTO record_author(record_id, author_id, role) VALUES(?, ?, ?);")
        authors.forEach(author => stmt.run(recordId, author.id, author.role === '' ? null : author.role))
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