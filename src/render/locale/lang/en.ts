export default {
    layout: {
        // ANCHOR components empty 
        thereIsNothingYet: 'There is nothing here yet~',

        // ANCHOR home page titlebar
        back: 'Back',
        forward: 'Forward',
        settings: 'Settings',

        // ANCHOR home page sidebar
        delete: 'Delete',
        rename: 'Rename',

        createdGroup: 'Created Group',
        addGroup: 'Add Group',
        newGroup: 'New Group',
        refresh: 'Refresh',
        select: 'Select',

        addLibrary: 'Add Library',
        newLibrary: 'New Library',
        importLibrary: 'Import Library',

        panel: 'Panel',
        manageData: 'Manage Data',
        openInNewWindow: 'Open in New Window',
        moveTo: 'Move To',
        openDataLocation: 'Open Data Location',
        export: 'Export',
        selectImportData: 'Select data to import',
        selectExportLocation: 'Select export location',

        // ANCHOR home page Dash
        records: 'Records',
        releaseDate: 'Release Date',
        authors: 'Authors',
        tags: 'Tags',
        dirnames: 'Folder Directories',
        recycleBin: 'Recycle Bin',
        aboutLibrary: 'About Library',

        exitBatchOperation: 'Exit Batch Operation',
        selectAll: 'Select All',
        putInRecycleBin: 'Put in Recycle Bin',
        restore: 'Restore',
        batchOperation: 'Batch Operation',
        emptyRecycleBin: 'Empty Recycle Bin',
        search: 'Search',
        deletePermanently: 'Delete Permanently',
        copyTitle: 'Copy Title',
        copyTitleAndAuthors: 'Copy Title and Authors',
        copyAllInfo: 'Copy All Information',
        edit: 'Edit',
        removeFromSeries: 'Remove from this Series',

        filter: 'Filter',
        hasCover: 'Has Cover',
        hasHyperlink: 'Has Hyperlink',
        hasFile: 'Has Source File',

        sortBy: 'Sort By',
        time: 'Time',
        title: 'Title',
        name: 'Name',
        path: 'Path',
        rate: 'Rating',
        ascending: 'Ascending',
        descending: 'Descending',

        view: 'View',
        compact: 'Compact',
        thumbnail: 'Thumbnail',
        extended: 'Extended',

        copyToClipboard: 'Copy to Clipboard',
        openInFileExplorer: 'Open in File Explorer',
        showInFileExplorer: 'Show in File Explorer',
        showImagesInExplorer: 'Show Images in Explorer',
        searchTitle: 'Search Title',
        openLinkInBrowser: 'Open Link in Browser',
        openWithDefaultProgram: 'Open with Default Program',

        // author
        detailInfo: 'Detailed Information',
        numberOfWorks: 'Number of Works',
        imageUrl: 'Image URL',

        // about
        useSearchAuxiliaryText: 'Use Search Auxiliary Text',
        searchAuxiliaryText: 'Search Auxiliary Text',

        // manage data
        addRecord: 'Add Record',
        editRecord: 'Edit Record',
        batchRecycleRecord: 'Batch Recycle Record',
        addAuthor: 'Add Author',
        editAuthor: 'Edit Author',
        editDir: 'Edit Directory',

        selectImage: 'Select Image',
        reset: 'Reset',
        create: 'Create',
        add: 'Add',
        modify: 'Modify',
        confirm: 'Confirm',
        cancel: 'Cancel',
        finish: 'Finish',
        replace: 'Replace',
        example: 'Example',
        iKnowTheConsequences: 'I understand the consequences, confirm deletion',

        // Function Introduction
        functionIntro: 'Function Introduction',

        avatar: 'Avatar',
        authorName: "Author's Name",
        authorIntro: "Author's Introduction",

        searchValue: 'Search Value',
        inputSearchValue: 'Input Search Value',
        replaceValue: 'Replace Value',
        inputReplaceValue: 'Input Replace Value',

        localSourcePath: 'Local Source Path',

        batchAdd: 'Batch Add',
        importDir: 'Import Directory',
        editRecordBatchAddPlaceholder: 'Absolute path of the resource directory, note that the Windows drive letter should be written as C:\\',
        editRecordDirnamePlaceholder: "The directory where the resource is located is an absolute path (dirname), note that the root directory should be written as 'C:\\' or '/'",
        editRecordBasenamePlaceholder: 'Basename, can be a file or a folder',
        editRecordTitlePlaceholder: 'Title of the record',
        editRecordAuthorsPlaceholder: 'Can only add existing authors',
        editRecordTagsPlaceholder: 'Will be added automatically if not in the library',
        editRecordIntroPlaceholder: 'Introduction of the record, related to its content',
        editRecordInfoPlaceholder: 'Additional information of the record, such as the location of file backups.',
        basenameCannotBeAlone: 'Basename cannot be filled in alone',
        titleNotEmpty: 'Title cannot be empty',
        importDirNotEmpty: 'Import directory cannot be empty',

        filterExisting: 'Filter existing ones',
        filterExistingP1: 'Skip when there are records with the same title as the basename',
        selectFile: 'Select File',
        selectDir: 'Select Directory',
        hyperlink: 'Hyperlink',
        editRecordHyperlinkPlaceholder: 'The URL you want to point to (e.g., www.google.com)',
        cover: 'Cover',
        noAuthors: 'No authors added',
        tag: 'Tag',
        tagName: 'Tag Name',
        noTags: 'No tags added',
        series: 'Series',
        seriesName: 'Series Name',
        noSeries: 'Not added to a series',
        dirname: 'Folder Directory',
        dirnamePath: 'Folder Directory Path',

        createdTime: 'Created Time',
        lastModifiedTime: 'Modified Time',
        sampleImages: 'Sample Images',
        intro: 'Introduction',
        info: 'Information',

        switchLanguage: 'Switch Language',
        changeDataLocation: 'Change Data Location',
        restartNow: 'Restart Now',

        // ANCHOR record page 
        allInfo: 'All Information',
        similarRecommendation: 'Similar Recommendations',
        noSimilarRecommendation: 'No similar recommendations yet',
        noSourcePath: 'Resource path not set',
        currentFolderIsEmpty: 'The current folder is empty',
        backToParentFolder: 'Back to Parent Folder',
        rootDir: 'Root Directory',
    },
    tips: {
        dangerousOperation: 'Dangerous Operation',
        confirmOperation: 'Confirm Operation',

        deleteLibraryP1: 'This operation cannot be undone! Data will be permanently deleted.',
        deleteLibraryP2: 'If you delete a group, all libraries under that group will be deleted.',
        deleteLibraryP3: 'Please enter',

        replaceDirnameFunctionIntroP1: 'Compare all existing paths from the beginning based on the input search value and replace the matching part of the path with the input replace value as the basic unit for folders.',
        replaceDirnameFunctionIntroP2: 'If you want to change C:\\foo\\a to C:\\bar\\a, and C:\\foo\\b to C:\\bar\\b,',
        replaceDirnameFunctionIntroP3: 'you can input C:\\foo in the search value and C:\\bar in the replace value.',
        replaceDirnameFunctionIntroP4: 'The basic unit is a folder, and this is not a simple string replacement. If you enter C:\\fo, it cannot be replaced.',

        // Please fill in at least one form item
        pleaseFillAtLeastOneForm: 'Please fill in at least one form item',

        sureAdd: 'Are you sure you want to add?',
        sureEdit: 'Are you sure you want to edit?',
        sureDelete: 'Are you sure you want to delete? Deletion cannot be undone!',

        pleaseInputNewValue: 'Please input a new value',
        inputValueNotEmpty: 'Input value cannot be empty',
        lengthLimitExceeded: 'Length exceeds limit ({count} characters)',

        sureRecycle: 'Are you sure you want to recycle?',
        surePutInRecycleBin: 'Are you sure you want to put in the recycle bin?',
        sureRestore: 'Are you sure you want to restore?',
        sureRemoveFromSeries: 'Are you sure you want to remove from this series?',

        // Name cannot be empty
        authorNameNotEmpty: 'Name cannot be empty',

        // Path Input Suggestion
        pathInputSuggestion: 'Path Input Suggestion',
        pathInputSuggestionP1: 'The program will not check if the path you fill in exists on the device, but it will check if the path is valid, such as the basename cannot exceed 255 characters and cannot contain \\/:*?"<>|, etc.',
        pathInputSuggestionP2: `It is best to use the path separator of the current platform (\\' | /'), as the backend will forcibly convert the separator to the separator of the current platform.`,
        pathInputSuggestionP3: `The path separator for Windows platform is \\, for other platforms, it is /. For example, C:\\foo or /root.`,

        // What is Batch Add
        whatIsBatchAdd: 'What is Batch Add',
        whatIsBatchAddP1: 'By reading the given directory, the software will traverse all files and folders in that directory, and then use the basename as the title of the record (the file extension will be removed) to add them to the database.',
        whatIsBatchAddP2: 'The attributes under the form will be added to all records imported in batch.',

        restartToMakeEffect: 'The changes will take effect after restarting. Do you want to restart now?',
        restartToMakeEffect2: 'Since the data location has been changed, it is recommended to restart the application to load the correct data. Do you want to restart now?',
    },
    msg: {
        deleteFailed: 'Deletion Failed',
        editSuccess: 'Edit Successful',
        editFailed: 'Edit Failed',
        createSuccess: 'Create Successful',
        createFailed: 'Create Failed',
        replaceSuccess: 'Replace Successful',
        recycleSuccess: 'Recycle Successful',

        recordNotExist: 'Record does not exist',
        authorNotExist: 'Author does not exist',
        thisTagAlreadyExists: 'This tag already exists',
        thisAuthorAlreadyExists: 'This author already exists',
        thisSeriesAlreadyExists: 'This series already exists',

        notExistsInFileExplorer: 'Does not exist in File Explorer',
        copiedToClipboard: 'Copied to clipboard',

        // Invalid Path
        invalidPath: 'Invalid Path',
    },
    settings: {
        settings: 'Settings',

        sponsor: 'Sponsor',
        addStar: 'Star the Project',
        addStarTips: 'If you like this project, you can give it a star to make it more visible to others',
        support: 'Economic Support',
        china: 'China',
        other: 'Other',

        general: 'General',
        language: 'Language',
        dataLocation: 'Data Location',
        searchEngine: 'Search Engine',
        openDir: 'Open Directory',
        changeDir: 'Change Directory',

        help: 'Help',
        contact: 'Contact Information',
        tutorial: 'Tutorial',
        version: 'Version',
        license: 'License',
    },
}
