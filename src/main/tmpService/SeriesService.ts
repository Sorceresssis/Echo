import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"
import SeriesDao from "../dao/SeriesDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"

@injectable()
class SeriesService {
    private seriesDao: SeriesDao
    private recordSeriesDao: RecordSeriesDao

    public constructor(
        @inject(DI_TYPES.SeriesDao) seriesDao: SeriesDao,
        @inject(DI_TYPES.RecordSeriesDao) recordSeriesDao: RecordSeriesDao,
    ) {
        this.seriesDao = seriesDao
        this.recordSeriesDao = recordSeriesDao
    }


}


export default SeriesService