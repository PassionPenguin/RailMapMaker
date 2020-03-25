/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initPenguinUI = (returnFunc) => {
    builder.importScripts(["./dist/libs/bundle/PenguinUI/require/CookieManager.js", "./dist/libs/bundle/PenguinUI/require/NotificationManager.js", "./dist/libs/bundle/PenguinUI/require/ProgressManager.js", "./dist/libs/bundle/PenguinUI/require/WindowManager.js"], () => {
        returnFunc();
    });
}
