import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"
import DirnameDao from "../dao/DirnameDao"

@injectable()
class DirnameService {
    private dirnameDao: DirnameDao

    public constructor(
        @inject(DirnameDao) dirnameDao: DirnameDao,
    ) {
        this.dirnameDao = dirnameDao
    }

}


export default DirnameService