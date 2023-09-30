import path from "path"
import appConfig from "../app/config"
import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import DynamicSqlBuilder from "../util/DynamicSqlBuilder"

@injectable()
class AutocompleteService {
    public constructor(
        @inject(DI_TYPES.Library) private library: DILibrary,
    ) {
    }

    public query(type: AcType, queryWord: string, ps: number): VO.AcSuggestion[] {
        const table = [
            "SELECT 'record' AS type, id, title AS value, cover AS image, REGEXP(title) AS sore FROM record WHERE sore > 0",
            "SELECT 'author' AS type, id, name AS value, avatar AS image, REGEXP(name) AS sore FROM author WHERE sore > 0",
            "SELECT 'tag' AS type, id, title AS value, NULL AS image, REGEXP(title) AS sore FROM tag WHERE sore > 0",
            "SELECT 'series' AS type, id, name AS value, NULL AS image, REGEXP(name) AS sore FROM  series WHERE sore > 0",
            "SELECT 'dirname' AS type, id, path AS value, NULL AS image, REGEXP(path) AS sore FROM dirname WHERE sore > 0",
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
        this.library.dbConnection.registerSQLFnRegexp(queryWord)
        const sqlBuilder = new DynamicSqlBuilder()

        sqlBuilder.append("SELECT type, id, value, image FROM (")
        // 把所有需要查询的表放入sql
        tableIdxs[type].forEach((v, i) => {
            if (i > 0) { sqlBuilder.append('UNION ALL') }
            sqlBuilder.append(table[v])
        })
        sqlBuilder.append(') ORDER BY sore DESC LIMIT 0, ?;', ps)

        const rows: VO.AcSuggestion[] = this.library.dbConnection.all(sqlBuilder.getSql(), ...sqlBuilder.getParams())

        const imageDirPath = appConfig.getLibraryImagesDirPath(this.library.id)
        rows.forEach(row => {
            if (row.image) row.image = path.join(imageDirPath, row.image)
        })
        return rows
    }
}


export default AutocompleteService