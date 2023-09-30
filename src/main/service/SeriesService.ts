import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import SeriesDao from "../dao/SeriesDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"

@injectable()
class SeriesService {

    public constructor(
        @inject(DI_TYPES.SeriesDao) private seriesDao: SeriesDao,
        @inject(DI_TYPES.RecordSeriesDao) private recordSeriesDao: RecordSeriesDao,
    ) {
    }


}


export default SeriesService