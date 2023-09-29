import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"

@injectable()
class AuthorDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryAuthorById(id: PrimaryKey): Domain.Author | undefined {
        return this.lib.dbConnection.get(`SELECT id, name, avatar, intro, DATETIME(gmt_create, 'localtime') AS createTime,
        DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM author WHERE id = ?;` , id)
    }

    public updateAuthor(author: Entity.Author): number {
        return this.lib.dbConnection.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name, author.avatar, author.intro, author.id).changes
    }

    public insertAuthor(author: Entity.Author): PrimaryKey {
        return this.lib.dbConnection.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);", author.name, author.avatar, author.intro).lastInsertRowid
    }

    public deleteAuthor(id: PrimaryKey): number {
        return this.lib.dbConnection.run(`DELETE FROM author WHERE id = ?; `, id).changes
    }
}


export default AuthorDao