import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"

@injectable()
class AuthorDao {
    private db: LibraryDB

    public constructor(@inject(DI_TYPES.LibraryDB) db: LibraryDB) {
        this.db = db
    }

    public queryAuthorById(id: PrimaryKey): VO.Author | undefined {

        return
    }

    public queryAuthorByKeyword(keyword: string,
        sortBy: any,
        offset: number,
        rowCount: number
    ): VO.Author[] {


        return []
    }


    public insertAuthor(author: Entity.Author): PrimaryKey {
        return this.db.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);",
            author.name, author.avatar, author.intro).lastInsertRowid
    }

    public updateAuthor(author: Entity.Author): number {
        return this.db.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name, author.avatar, author.intro, author.id).changes
    }

    public deleteAuthor(id: PrimaryKey): number {
        return this.db.run("DELETE FROM author WHERE id = ?;", id).changes
    }
}


export default AuthorDao