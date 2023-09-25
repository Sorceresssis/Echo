import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"

@injectable()
class TagDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

}


export default TagDao