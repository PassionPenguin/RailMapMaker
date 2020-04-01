/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const savePathComp = {
    current: () => {
        LocaleStorageManager.set("fileData_" + state.fileId, JSON.stringify(contentData));
    }, id: (id, data) => {
        LocaleStorageManager.set("fileData_" + id, JSON.stringify(data));
    }
}