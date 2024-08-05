import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import type SeriesDao from "../dao/SeriesDao"
import type RecordSeriesDao from "../dao/RecordSeriesDao"

@injectable()
class SeriesService {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv,
        @inject(InjectType.SeriesDao) private seriesDao: SeriesDao,
        @inject(InjectType.RecordSeriesDao) private recordSeriesDao: RecordSeriesDao,
    ) { }

    public removeRecordFromSeries(recordId: number, seriesId: number): void {
        this.recordSeriesDao.deleteRecordSeriesByRecordIdSeriesIds(recordId, [seriesId])
    }

    public editSeries(id: number, name: string): void {
        name = name.trim()
        if (name === '') throw Error('series name can not be empty')

        const existId = this.seriesDao.querySeriesIdByName(name)

        this.libEnv.db.transactionExec(() => {
            if (existId && existId !== id) {
                // 如果已经存在，就把原来的记录移到新的标签下
                this.recordSeriesDao.updateSeriesIdBySeriesId(existId, id)
                this.seriesDao.deleteSeries(existId)
            } else {
                this.seriesDao.updateSeriesName(id, name)
            }
        })
    }

    public deleteSeries(id: number): void {
        this.libEnv.db.transactionExec(() => {
            this.seriesDao.deleteSeries(id)
            this.recordSeriesDao.deleteRecordSeriesBySeriesId(id)
        })
    }
}


export default SeriesService