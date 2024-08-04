export class VueInjectKey {
    // page
    public static WINDOW_LOADING = Symbol('WINDOW_LOADING')
    public static TITLEBAR_TITLE = Symbol('TITLEBAR_TITLE')

    // component
    public static MANAGE_PAGE_PATH_PATTERN = Symbol('MANAGE_PAGE_PATH_PATTERN')

    // Data
    public static OPENING_LIBRARY = Symbol('OPENING_LIBRARY')
    public static ACTIVE_LIBRARY = Symbol('ACTIVE_LIBRARY')
    public static ACTIVE_LIBRARY_DETAIL = Symbol('ACTIVE_LIBRARY_DETAIL')
    public static RECORD = Symbol('RECORD')
}


export class LocalStorageKey {
    public static EXPANDED_GROUPS = "EXPANDED_GROUPS"

    public static PREVIOUS_ACTIVE_LIBRARY = "PREVIOUS_ACTIVE_LIBRARY"
}

export class CrosTabBroadcastKey {
    public static CHANNEL = {
        mainTab: "MAIN_TAB",
        recordTab: "RECORD_TAB",
    }
    public static MSG_TYPE = {
        reloadGroups: "RELOAD_GROUPS",
        reloadLibraryDetail: "RELOAD_LIBRARY_DETAIL",
    }
}
