import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"
import SeriesDao from "../dao/SeriesDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"

@injectable()
class SeriesService {

    public constructor(
        @inject(DI_TYPES.Library) private library: DILibrary,
        @inject(DI_TYPES.SeriesDao) private seriesDao: SeriesDao,
        @inject(DI_TYPES.RecordSeriesDao) private recordSeriesDao: RecordSeriesDao,
    ) {
    }

    public removeRecordFromSeries(recordId: number, seriesId: number): void {
        this.recordSeriesDao.deleteRecordSeriesByRecordIdSeriesIds(recordId, [seriesId])
    }

    public editSeries(id: number, name: string): void {
        name = name.trim()
        if (name === '') throw Error('series name can not be empty')

        const existId = this.seriesDao.querySeriesIdByName(name)

        this.library.dbConnection.transaction(() => {
            if (existId !== undefined && existId !== id) {
                // 如果已经存在，就把原来的记录移到新的标签下
                this.recordSeriesDao.updateSeriesIdBySeriesId(existId, id)
                this.seriesDao.deleteSeries(existId)
            } else {
                this.seriesDao.updateSeriesName(id, name)
            }
        })
    }

    public deleteSeries(id: number): void {
        this.library.dbConnection.transaction(() => {
            this.seriesDao.deleteSeries(id)
            this.recordSeriesDao.deleteRecordSeriesBySeriesId(id)
        })
    }
}


export default SeriesService