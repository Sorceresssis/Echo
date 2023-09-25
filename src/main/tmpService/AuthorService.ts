import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"
import AuthorDao from "../dao/AuthorDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"

@injectable()
class AuthorService {
    private authorDao: AuthorDao
    private recordAuthorDao: RecordAuthorDao

    public constructor(
        @inject(AuthorDao) authorDao: AuthorDao,
        @inject(RecordAuthorDao) recordAuthorDao: RecordAuthorDao,
    ) {
        this.authorDao = authorDao
        this.recordAuthorDao = recordAuthorDao
    }


}


export default AuthorService