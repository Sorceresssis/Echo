import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
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



    deleteTag(id: number) {
        DIContainer.get<DILibrary>(DI_TYPES.Library).dbConnection.transaction(() => {
            // this.recordTagDao.deleteRecordTagByTagId(id)
            this.tagDao.deleteTagById(id)
        })
    }
}


export default TagService