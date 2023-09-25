import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import TagDao from "../dao/TagDao"
import RecordTagDao from "../dao/RecordTagDao"

@injectable()
class TagService {
    private tagDao: TagDao
    private recordTagDao: RecordTagDao

    public constructor(
        @inject(TagDao) tagDao: TagDao,
        @inject(RecordTagDao) recordTagDao: RecordTagDao,
    ) {
        this.tagDao = tagDao
        this.recordTagDao = recordTagDao
    }
}


export default TagService