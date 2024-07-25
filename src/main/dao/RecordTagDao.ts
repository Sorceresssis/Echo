import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class RecordTagDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public queryCountOfRecordsByTagId(tagId: PrimaryKey): number {
        return this.libEnv.db.prepare('SELECT COUNT(record_id) FROM record_tag WHERE tag_id = ?;').pluck().get(tagId) as number
    }

    public queryRecordIdsByTagId(tagId: PrimaryKey, offset: number, rowCount: number): number[] {
        return this.libEnv.db.prepare('SELECT record_id FROM record_tag WHERE tag_id = ? LIMIT ?,?;').pluck().all(tagId, offset, rowCount) as number[]
    }

    public querySimilarRecordIdsByRecordId(recordId: PrimaryKey, rowCount: number = 10,): { id: number, similarity: number }[] {
        const sql = `
        SELECT rt2.record_id AS id, COUNT(rt2.tag_id) AS similarity
        FROM
	        record_tag rt1
	        JOIN record_tag rt2 ON rt1.tag_id = rt2.tag_id
        WHERE rt1.record_id = ? AND rt2.record_id != ?
        GROUP BY rt2.record_id
        ORDER BY similarity DESC
        LIMIT 0, ?;`
        // TODO Jaccard Similarity J(A, B) = | A ∩ B | / |A ∪ B|
        // 
        // rt1 join rt2 查出所有与当前record有相同tag的record
        // SELECT
        //     rt2.record_id AS id,
        //     CAST(SUM(rt1.tag_id = rt3.tag_id) AS REAL) / CAST(COUNT(rt3.tag_id) AS REAL) AS similarity
        // FROM
        //     record_tag rt1
        //     JOIN record_tag rt2 ON rt1.tag_id = rt2.tag_id
        //     JOIN record_tag rt3 ON rt2.record_id = rt3.record_id
        // WHERE rt1.record_id = ? AND rt2.record_id != ?
        // GROUP BY rt2.record_id
        // ORDER BY similarity DESC
        // LIMIT 0, ?;`

        return this.libEnv.db.all(sql, recordId, recordId, rowCount)
    }

    public updateTagIdByTagId(tagId: PrimaryKey, newTagId: PrimaryKey): void {
        // Note 由于 record_tag 中的 record_id 和 tag_id 有联合 UNIQUE 约束
        // 如果 newTagId 与 tagId 有相同的record_id, 直接修改会有(record_id, tag_id)重复的情况,导致修改失败
        // 解决方法：分别找出newTagId和tagId的record_id，把相同的record_id删除，把不同的record_id修改

        // 先添加tag_id的筛选条件，为了走索引, 减少扫描行数
        this.libEnv.db.run('DELETE FROM record_tag WHERE tag_id = ? AND record_id IN (SELECT record_id FROM record_tag WHERE tag_id = ? INTERSECT SELECT record_id FROM record_tag WHERE tag_id = ?);',
            tagId, tagId, newTagId)
        this.libEnv.db.run('UPDATE record_tag SET tag_id = ? WHERE tag_id = ?;', newTagId, tagId)
    }

    public insertRecordTagByRecordIdTagIds(recordId: PrimaryKey, tagIds: PrimaryKey[]): void {
        const stmt = this.libEnv.db.prepare("INSERT INTO record_tag(record_id, tag_id) VALUES(?,?);")
        tagIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordTagByRecordIdTagIds(recordId: PrimaryKey, tagIds: PrimaryKey[]): void {
        const stmt = this.libEnv.db.prepare("DELETE FROM record_tag WHERE record_id = ? AND tag_id = ?;")
        tagIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordTagByTagId(tagId: PrimaryKey): number {
        return this.libEnv.db.run('DELETE FROM record_tag WHERE tag_id = ?;', tagId).changes
    }

    public deleteRecordTagByRecordId(recordId: PrimaryKey): number {
        return this.libEnv.db.run('DELETE FROM record_tag WHERE record_id = ?;', recordId).changes
    }
}


export default RecordTagDao