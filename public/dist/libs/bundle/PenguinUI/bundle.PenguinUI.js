/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initPenguinUI = (returnFunc) => {
    let PenguinUI = {};
    builder.importScripts(["./dist/libs/bundle/PenguinUI/require/CookieManager.js", "./dist/libs/bundle/PenguinUI/require/NotificationManager.js", "./dist/libs/bundle/PenguinUI/require/ProgressManager.js", "./dist/libs/bundle/PenguinUI/require/WindowManager.js", "./dist/libs/bundle/PenguinUI/require/HoverTips.js", "./dist/libs/bundle/PenguinUI/require/PenguinUI.selector.js", "./dist/libs/bundle/PenguinUI/require/PenguinUI.switchToggle.js", "./dist/libs/bundle/PenguinUI/require/LocaleStorageManager.js", "./dist/libs/bundle/PenguinUI/require/MediaQuery.js", "./dist/libs/bundle/PenguinUI/require/utils.js"], () => {
        returnFunc();
    });
}
