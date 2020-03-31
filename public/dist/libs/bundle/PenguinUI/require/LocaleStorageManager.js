/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const LocaleStorageManager = {
    storage: null,
    init: () => {
        LocaleStorageManager.storage = window.localStorage;
        LocaleStorageManager.set("Server", "PassionPenguin");
        LocaleStorageManager.set("App", "RailMapMaker");
        LocaleStorageManager.set("Version", "v1.2");
    }, set: (key, value) => {
        LocaleStorageManager.storage === null ? LocaleStorageManager.init() : void (0);
        LocaleStorageManager.storage.setItem(key, value);
    }, get: (key) => {
        LocaleStorageManager.storage === null ? LocaleStorageManager.init() : void (0);
        return LocaleStorageManager.storage.getItem(key);
    }, clearData: () => {
        window.localStorage.clear();
    }
}