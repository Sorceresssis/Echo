import { app } from "electron"
import n_path from 'path'
import n_fs from 'fs'
import appConfig from './config'
import generateUid from "../util/uid"

// 用户数据目录
// userDataPath
// ├── group.db
// └── library
//     └── {library_id}
//         ├── library.db
//         └── image
//             ├── record
//             │   └── {record_id}
//             │       ├── main
//             │       ├── smp1
//             │       ├── smp2
//             │       └── ...
//             └── author
//                 └── {author_id}
//                     ├── avatar
//                     ├── smp1
//                     ├── smp2
//                     └── ...

type SampleImagesWithIdx = {
    idx: number,
    path: string
}

class AppPaths {
    public static readonly imageFileExt = 'avif'
    public static readonly imageFileExtDot = `.${AppPaths.imageFileExt}`

    private userDataPath = appConfig.get('dataPath')

    public getImportLibraryTmpDirPath(): string {
        return n_path.join(this.userDataPath, 'tmp', 'import-library')
    }

    public getGroupDBFilePath(): string {
        return n_path.join(this.userDataPath, 'group.db')
    }

    public getLibraryDirPath(libId: PrimaryKey): string {
        return n_path.join(this.userDataPath, 'library', `${libId}`)
    }

    public getLibraryDBFilePath(libId: PrimaryKey): string {
        return n_path.join(this.userDataPath, 'library', `${libId}`, 'library.db')
    }

    // 生成image构造器
    public genLibraryImagesDirPathConstructor(libId: PrimaryKey) {
        const libraryDirPath = this.getLibraryDirPath(libId)


        const genRecordImagesDirPathConstructor = function (id: number | bigint) {
            const recordImagesDirPath = n_path.join(libraryDirPath, 'images', 'record', `${id}`)
            n_fs.mkdirSync(recordImagesDirPath, { recursive: true })

            const __mainImageFileNameTpl = `r${id}_main`
            const __sampleFileNameTpl = `r${id}_smp`
            const sampleIdxPattern = /_smp(\d+)_/;

            // 图片目录
            const getImagesDirPath = () => recordImagesDirPath
            // 主图 r1_main_1711284231896.avif
            const getNewMainImageFilePath = () => n_path.join(recordImagesDirPath, `${__mainImageFileNameTpl}_${Date.now()}${AppPaths.imageFileExtDot}`)
            // 样图 r1_smp1_1711284231896.avif
            const getNewSampleImageFilePath = (index: number) => n_path.join(recordImagesDirPath, `${__sampleFileNameTpl}${index}_${Date.now()}${AppPaths.imageFileExtDot}`)

            const findMainImageFilePath = () => {
                const list = n_fs.readdirSync(recordImagesDirPath)
                let filePath
                for (const file of list) {
                    if (file.startsWith(__mainImageFileNameTpl)) {
                        filePath = n_path.join(recordImagesDirPath, file)
                        break
                    }
                }
                return filePath
            }
            const findMainAndSampleImageFilePaths = () => {
                const sampleImagesWithIdx: SampleImagesWithIdx[] = []
                let main: string | undefined

                let notFoundAvatar = true
                n_fs.readdirSync(recordImagesDirPath).forEach(item => {
                    if (notFoundAvatar && item.startsWith(__mainImageFileNameTpl)) {
                        main = n_path.join(recordImagesDirPath, item)
                        notFoundAvatar = false
                    }
                    if (item.startsWith(__sampleFileNameTpl)) {
                        sampleImagesWithIdx.push({
                            idx: parseInt(item.match(sampleIdxPattern)![1], 10),
                            path: n_path.join(recordImagesDirPath, item)
                        })
                    }
                })
                sampleImagesWithIdx.sort((a, b) => a.idx - b.idx)
                const sampleImages = sampleImagesWithIdx.map(item => item.path)

                return {
                    main,
                    sampleImages
                }
            }
            return {
                getImagesDirPath,
                getNewMainImageFilePath,
                getNewSampleImageFilePath,
                findMainImageFilePath,
                findMainAndSampleImageFilePaths,
            }
        }

        const genAuthorImagesDirPathConstructor = function (id: number | bigint) {
            const authorImagesDirPath = n_path.join(libraryDirPath, 'images', 'author', `${id}`)
            n_fs.mkdirSync(authorImagesDirPath, { recursive: true })

            const __avatarFileNameTpl = `a${id}_avatar`
            const __sampleFileNameTpl = `a${id}_smp`
            const sampleIdxPattern = /_smp(\d+)_/;

            // 作者图片目录
            const getImagesDirPath = () => authorImagesDirPath
            // 头像 a1_avatar_1711284231896.avif
            const getNewAvatarImageFilePath = () => n_path.join(authorImagesDirPath, `${__avatarFileNameTpl}_${Date.now()}${AppPaths.imageFileExtDot}`)
            // 样图 a1_smp1_1711284231896.avif
            const getNewSampleImageFilePath = (index: number) => n_path.join(authorImagesDirPath, `${__sampleFileNameTpl}${index}_${Date.now()}${AppPaths.imageFileExtDot}`)

            const findAvatarImageFilePath = () => {
                const list = n_fs.readdirSync(authorImagesDirPath)
                let filePath
                for (const file of list) {
                    if (file.startsWith(__avatarFileNameTpl)) {
                        filePath = n_path.join(authorImagesDirPath, file)
                        break
                    }
                }
                return filePath
            }
            const findAvatarAndSampleImageFilePaths = () => {
                const sampleImagesWithIdx: SampleImagesWithIdx[] = []
                let avatar: string | undefined

                let notFoundAvatar = true
                n_fs.readdirSync(authorImagesDirPath).forEach(item => {
                    if (notFoundAvatar && item.startsWith(__avatarFileNameTpl)) {
                        avatar = n_path.join(authorImagesDirPath, item)
                        notFoundAvatar = false
                    }
                    if (item.startsWith(__sampleFileNameTpl)) {
                        sampleImagesWithIdx.push({
                            idx: parseInt(item.match(sampleIdxPattern)![1], 10),
                            path: n_path.join(authorImagesDirPath, item)
                        })
                    }
                })
                sampleImagesWithIdx.sort((a, b) => a.idx - b.idx)
                const sampleImages = sampleImagesWithIdx.map(item => item.path)

                return {
                    avatar,
                    sampleImages
                }
            }
            return {
                getImagesDirPath,
                getNewAvatarImageFilePath,
                getNewSampleImageFilePath,
                findAvatarImageFilePath,
                findAvatarAndSampleImageFilePaths,
            }
        }
        return {
            genRecordImagesDirPathConstructor,
            genAuthorImagesDirPathConstructor,
        }
    }

    public getMetadataDir(dir: string) {
        return n_path.join(dir, '.metadata')
    }

    public getEchoMetadataPath(dir: string) {
        return n_path.join(dir, '.metadata', 'echo_metadata.json')
    }

    public getEchoMetadataImagesDirPath(dir: string) {
        return n_path.join(dir, '.metadata', 'images')
    }

    public getMultipleMetadataImportErrorLogPath() {
        return n_path.join(app.getPath('desktop'), `Echo_ImportMetadataError_${generateUid()}.txt`)
    }
}

const appPaths = new AppPaths()

export default appPaths