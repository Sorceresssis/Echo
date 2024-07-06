declare namespace RP {
    /**
     * type  0: 单个 1: 批量
     *  operate 0: 添加 1: 跟新 2: 添加和更新
     */
    interface AddRecordFromMetadataParam {
        type: number        // 0: 单个 1: 批量
        operate: 0 | 1 | 2
        dir: string
    }
}