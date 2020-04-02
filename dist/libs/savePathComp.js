/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const savePathComp = {
    current: () => {
        contentData.lastModified = new Date().getTime();
        LocaleStorageManager.set("fileData_" + state.fileId, JSON.stringify(contentData));
    }, id: (id, data) => {
        data.lastModified = new Date().getTime();
        LocaleStorageManager.set("fileData_" + id, JSON.stringify(data));
    }
}