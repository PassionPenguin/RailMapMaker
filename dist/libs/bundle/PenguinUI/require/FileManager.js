/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const FileManager = {
    storage: null,
    init: () => {
        FileManager.storage = window.localStorage;
        FileManager.set("Server", "PassionPenguin");
        FileManager.set("App", "RailMapMaker");
        FileManager.set("Version", "v1.2");
    }, set: (key, value) => {
        FileManager.storage === null ? FileManager.init() : void (0);
        FileManager.storage.setItem(key, value);
    }, get: (key) => {
        FileManager.storage === null ? FileManager.init() : void (0);
        return FileManager.storage.getItem(key);
    }, clearData: () => {
        FileManager.storage === null ? FileManager.init() : void (0);
        FileManager.clearData();
    }
}