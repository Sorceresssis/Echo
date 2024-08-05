export default {
    layout: {
        // ANCHOR components empty 
        thereIsNothingYet: '还没有任何东西哦~',

        // ANCHOR home page titlebar
        back: '后退',
        forward: '前进',
        settings: '设置',

        // ANCHOR home page siderbar
        delete: '删除',
        rename: '重命名',

        createdGroup: '创建的组',
        addGroup: '添加组',
        newGroup: '新建组',
        refresh: '刷新',
        select: '选择',

        addLibrary: '添加库',
        newLibrary: '新建库',
        importLibrary: '导入库',

        panel: '面板',
        manageData: '管理数据',
        openInNewWindow: '在新建窗口中打开',
        moveTo: '移动到',
        openDataLocation: '打开数据保存位置',
        export: '导出',
        selectImportData: '请选择要导入的数据',
        selectExportLocation: '请选择要导出的位置',


        // ANCHOR home page Dash

        records: '记录',
        releaseDate: '发布日期',
        authors: '作者',
        authorRoles: '作者角色',
        tags: '标签',
        dirnames: '文件夹目录',
        recycleBin: '回收站',
        aboutLibrary: '关于库',

        exitBatchOperation: '退出批量操作',
        selectAll: '全选',
        putInRecycleBin: '放入回收站',
        restore: '恢复',
        batchOperation: '批量操作',
        emptyRecycleBin: '清空回收站',
        search: '搜索',
        deletePermanently: '彻底删除',
        copyTitle: '复制标题',
        copyTitleAndAuthors: '复制标题和作者',
        copyAllInfo: '复制全部信息',
        edit: '编辑',
        removeFromSeries: '从该系列中移除',

        filter: '过滤',
        hasCover: '有封面',
        hasHyperlink: '有链接',
        hasFile: '有源文件',

        sortBy: '排序',
        time: '时间',
        title: '标题',
        translated_title: '译后标题',
        name: '名字',
        path: '路径',
        rate: '评分',
        ascending: '升序',
        descending: '降序',

        view: '视图',
        compact: '紧凑',
        thumbnail: '缩略图',
        extended: '扩展',

        copyToClipboard: '复制到剪贴板',
        openInFileExplorer: '资源管理器中打开',
        showInFileExplorer: '资源管理器中显示',
        showImagesInExplorer: '在资源管理器中显示图片',
        searchTitle: '搜索标题',
        openLinkInBrowser: '浏览器中打开链接',
        openWithDefaultProgram: '默认程序打开',

        // author
        detailInfo: '详细信息',
        numberOfWorks: '作品数',
        imageUrl: '图片地址',

        // about
        useSearchAuxiliaryText: '使用搜索辅助文本',
        searchAuxiliaryText: '搜索辅助文本',

        // manage data
        addRecord: '添加记录',
        editRecord: '编辑记录',
        addRecordFromMetadata: '从元数据添加',
        batchRecycleRecord: '批量回收记录',
        addAuthor: '添加作者',
        editAuthor: '编辑作者',
        editDir: '编辑目录',

        selectImage: '选择图片',
        reset: '重置',
        create: '添加',
        add: '添加',
        modify: '修改',
        confirm: '确认',
        cancel: '取消',
        finish: '完成',
        replace: '替换',
        example: '举例',
        iKnowTheConsequences: '我明白后果，确认删除',

        // 功能介绍
        functionIntro: '功能介绍',

        avatar: '头像',
        authorName: '作者的名字',
        authorIntro: '作者的介绍',

        searchValue: '搜索值',
        inputSearchValue: '输入搜索值',
        replaceValue: '替换值',
        inputReplaceValue: '输入替换值',

        localSourcePath: '本地资源路径',

        editRecordDirnamePlaceholder: `资源所在的目录，是一个绝对路径(dirname), 注意根目录要写成'C:\\'或'/'`,
        editRecordBasenamePlaceholder: `basename,可以是文件也可以是文件夹`,
        editRecordTitlePlaceholder: '记录的标题',
        editRecordAuthorsPlaceholder: '只能添加已经存在的作者',
        editRecordTagsPlaceholder: '库中没有则会自动添加',
        editRecordPlotPlaceholder: '记录的情节或者大致的内容',
        editRecordSearchTextPlaceholder: '希望搜索时命中但是又不想暴露在标题或者tag中的文本',
        editRecordReviewsPlaceholder: '记录的个人点评, 感受',
        editRecordInfoPlaceholder: '记录的额外信息, 比如文件备份的保存位置.',

        basenameCannotBeAlone: '不能单独填写basename',
        titleNotEmpty: '标题不能为空',

        selectFile: '选择文件',
        selectDir: '选择文件夹',
        hyperlink: '链接',
        editRecordHyperlinkPlaceholder: '希望指向的网址(例: www.google.com)',
        cover: '封面',
        noAuthors: '没有添加作者',
        tag: '标签',
        tagName: '标签名',
        noTags: '没有添加标签',
        series: '系列',
        seriesName: '系列名',
        noSeries: '没有加入系列',
        dirname: '文件夹目录',
        dirnamePath: '文件夹目录路径',


        createdTime: '创建时间',
        lastModifiedTime: '修改时间',
        intro: '介绍',
        plot: '内容',
        searchText: '搜索文本',
        reviews: '点评',
        sampleImages: '样例图片',
        info: '信息',

        switchLanguage: '切换语言',
        changeDataLocation: '更改数据保存位置',
        restartNow: '立即重启',


        // ANCHOR record page 

        allInfo: '全部信息',
        similarRecommendation: '相似推荐',
        noSimilarRecommendation: '暂无相似推荐',
        noSourcePath: '未设置资源路径',
        currentFolderIsEmpty: '当前文件夹为空',
        backToParentFolder: '返回上一级',
        rootDir: '根目录',
    },
    tips: {
        dangerousOperation: '危险操作',
        confirmOperation: '确认操作',

        // 删除库 
        deleteLibraryP1: '此操作无法撤销! 数据会被永久删除。',
        deleteLibraryP2: '如果删除的是组, 那么该组下的所有库都会被删除。',
        deleteLibraryP3: '请输入',



        replaceDirnameFunctionIntroP1: '根据输入的搜索值去从头开始, 以文件夹为基本单位对比所有已有的路径. 把匹配的部分路径替换成输入的替换值',
        replaceDirnameFunctionIntroP2: '如果你想把 C:\\foo\\a 变成 C:bar\\a, C:\\foo\\b 变成 C:\\bar\\b',
        replaceDirnameFunctionIntroP3: '你可以在搜索值里输入C:\\foo, 替换值里输入 C:\\bar',
        replaceDirnameFunctionIntroP4: '匹配的基本单位是文件夹, 这不是简单的字符串替换, 如果你搜索值输入的是C:\\fo 这是无法实现替换的',

        // 请至少填写一个表单项
        pleaseFillAtLeastOneForm: '请至少填写一个表单项',


        sureAdd: '确定要添加吗?',
        sureEdit: '确定要修改吗?',
        sureDelete: '确定要删除吗? 删除后无法恢复!',

        pleaseInputNewValue: '请输入新值',
        inputValueNotEmpty: '输入值不能为空',
        lengthLimitExceeded: '长度超过限制( {count} 个字符)',

        sureRecycle: '确定要回收吗?',
        surePutInRecycleBin: '确定要放入回收站吗？',
        sureRestore: '确定要恢复吗?',
        sureRemoveFromSeries: '确定要从该系列中移除吗?',

        // 姓名不能为空
        authorNameNotEmpty: '姓名不能为空',

        // 路径输入建议
        pathInputSuggestion: '路径输入建议',
        pathInputSuggestionP1: '程序不会去检查你填写的路径是否在设备上存在，但是会检查路径是否合法, 比如basename不能超过255个字且不能包含\\/:*?"<>|等',
        pathInputSuggestionP2: `最好使用当前平台的分隔符('\\' | '/')，因为后台会强制把分隔符转化成当前平台的分隔符.`,
        pathInputSuggestionP3: `windows平台路径分隔符是'\\', 输入类似于C:\\foo。其他平台的路径分隔符是'/'。输入类似于/root`,

        restartToMakeEffect: '重启后才能生效, 是否立即重启?',
        restartToMakeEffect2: '由于数据保存位置被改变，建议您重启应用程序以加载正确的数据, 是否立即重启?',
    },
    msg: {
        deleteFailed: '删除失败',
        editSuccess: '编辑成功',
        editFailed: '编辑失败',
        createSuccess: '添加成功',
        createFailed: '添加失败',
        replaceSuccess: '替换成功',
        recycleSuccess: '回收成功',

        recordNotExist: '记录不存在',
        authorNotExist: '作者不存在',
        thisTagAlreadyExists: '该标签已存在',
        thisAuthorAlreadyExists: '该作者已存在',
        thisSeriesAlreadyExists: '该系列已存在',
        duplicateAuthorName: '作者名重复, 请重新输入',

        notExistsInFileExplorer: '资源管理器中不存在',
        copiedToClipboard: '已复制到剪贴板',

        // 路径不合法
        invalidPath: '路径不合法',
    },

    settings: {
        settings: '设置',

        sponsor: '赞助',
        addStar: '给项目加星',
        addStarTips: '如果你喜欢这个项目，可以给项目加星，这样可以让更多的人看到这个项目',
        support: '经济支持',
        china: '中国',
        other: '其他',

        general: '常规',
        language: '语言',
        dataLocation: '数据保存位置',
        searchEngine: '搜索引擎',
        openDir: '打开目录',
        changeDir: '更改目录',

        help: '帮助',
        contact: '联系方式',
        turorial: '教程',
        version: '版本',
        license: '版权',
    },
}