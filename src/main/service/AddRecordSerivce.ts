import LibraryDao from "../dao/libraryDao"
import tokenizer from "../util/tokenizer"

export default class LibraryQueryService {
    libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryDao = new LibraryDao(libraryId)
    }

    public addRecord(record: any,): void {
        // 根据添加属性

        // 获得id, 然后格局id添加各个属性

        // 删除记录和标签的联系
        // deleteRecordTag(recordId: number, tagTitle:string): void {}
        // 添加记录和标签的联系
        // addRecordTag(recordId: number, tagTitle:string): void {}

        // 得到删除id
    }

    private SingleAdd(): void {
        // 判断id是否为0


    }

    private BatchAdd(): void {

    }


}