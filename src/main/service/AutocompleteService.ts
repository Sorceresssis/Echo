import path from "path"
import appConfig from "../app/config"
import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder from "../util/DynamicSqlBuilder"

@injectable()
class AutocompleteService {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv,
    ) {
    }

    public query(type: AcType, queryWord: string, ps: number): VO.AcSuggestion[] {
        const table = [
            "SELECT 'record' AS type, id, title AS value, REGEXP(title) + REGEXP(search_text) AS sore FROM record WHERE sore > 0",
            "SELECT 'author' AS type, id, name AS value, REGEXP(name) AS sore FROM author WHERE sore > 0",
            "SELECT 'tag' AS type, id, title AS value, REGEXP(title) AS sore FROM tag WHERE sore > 0",
            "SELECT 'series' AS type, id, name AS value, REGEXP(name) AS sore FROM  series WHERE sore > 0",
            "SELECT 'dirname' AS type, id, path AS value, REGEXP(path) AS sore FROM dirname WHERE sore > 0",
        ]
        const tableIdxs = {
            search: [0, 1, 2],
            record: [0],
            author: [1],
            tag: [2],
            series: [3],
            dirname: [4],
        }

        // 生成REGEXP函数
        this.libEnv.db.registerSQLFnRegexp(queryWord)
        const sqlBuilder = new DynamicSqlBuilder()

        sqlBuilder.append("SELECT type, id, value FROM (")
        // 把所有需要查询的表放入sql
        tableIdxs[type].forEach((v, i) => {
            if (i > 0) { sqlBuilder.append('UNION ALL') }
            sqlBuilder.append(table[v])
        })
        sqlBuilder.append(') ORDER BY sore DESC LIMIT 0, ?;', ps)

        const rows: VO.AcSuggestion[] = this.libEnv.db.all(sqlBuilder.getSql(), ...sqlBuilder.getParams())

        rows.forEach(row => {
            if (row.type === 'record') row.image = this.libEnv.genRecordImagesDirPathConstructor(row.id).findMainImageFilePath()
            if (row.type === 'author') row.image = this.libEnv.genAuthorImagesDirPathConstructor(row.id).findAvatarImageFilePath()
        })
        return rows
    }
}


export default AutocompleteService