/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const builder = {
    installable: false,
    debugMode: false,
    version: "1.5",
    bundles: [{name: "PenguinUI", version: "0.1.7"}],
    displayVersion: "Cola/(RMG v1.5 Stable)",
    locales: ["zh-CN", "zh-HK", "zh-YUE", "en-US"],
    buildTime: 1586010235748,
    debug: (pkg, src, tag, msg) => {
        if (builder.debugMode)
            console.debug("%c> " + pkg + "%c>> " + src + "%c\n" + tag + ":\t %c" + msg, "color:var(--grey);margin:10px auto 0 auto;display:block;font:900 12px/1 Anodina,sans-serif;", "color:var(--black);margin:0 auto 20px auto;display:block;font:900 14px/1 Anodina,sans-serif;", "color:var(--black);margin:10px 20px 0 0;display:context;font:14px/21px Anodina,sans-serif;", "color:var(--black);margin:0;display:context;font:12px/21px Anodina,sans-serif;");
    }, init: (returnFunc) => {
        builder.debug("PassionPenguin/RailMapMaker", "builder.package.js", "Network", "loaded script: build.package.js");

        LocaleStorageManager.get("fileList") === null || LocaleStorageManager.get("fileList") === "" ? LocaleStorageManager.set("fileList", "[]") : void (0);

        window.state = {
            newPath: true,
            pathId: -1, currentNode: "editingStations", stationStyle: "rect",
            fileId: JSON.parse(LocaleStorageManager.get("fileList")).length - 1
        };

        window.contentData = {
            pathInfo: []
        };


        if (CookieManager.get("language") === "" || isNaN(Int(CookieManager.get("language"))) || Int(CookieManager.get("language")) > builder.locales.length - 1) {
            for (let i = 0; i < navigator.languages.length; i++) {
                if (builder.locales.indexOf(navigator.languages[i]) !== -1) {
                    pg.language = builder.locales.indexOf(navigator.languages[i]);
                    break;
                }
            }
            if (pg.language === undefined)
                pg.language = 0;

            CookieManager.set("language", pg.language);
        } else pg.language = Int(CookieManager.get("language"));

        ProgressManager.update(0, 25, 100);

        builder.importStyles(["./dist/libs/bundle/PenguinUI/bundle.PenguinUI.css", "./dist/libs/bundle/storyboard/bundle.storyboard.css"]);
        ProgressManager.update(0, 33.3, 100);
        builder.importScripts(["./dist/libs/attachWindowCursorEvent.js", "./dist/libs/initInterface.js", "./dist/libs/exportDrawable.js", "./dist/libs/drawMap.js", "./dist/libs/initDrawable.js", "./dist/libs/SystemFunction.js", "./dist/libs/editPathsInfo.js", "./dist/libs/editStationsInfo.js", "./dist/libs/savePathComp.js", "./dist/libs/colorUtils.js", "./assets/Colors/Colors.js", "./assets/locales/" + builder.locales[pg.language] + ".js"], returnFunc);
        ProgressManager.update(0, 66.6, 100);
    },
    importScripts: (urls, returnFunc) => {
        // urls=>array/string
        builder.debug("PassionPenguin/RailMapMaker", "builder.package.js", "Network", "Importing Components Session Started");
        urls = typeof urls === "object" ? urls : [urls];
        let stateId = 0;
        let importScript = () => {
            let script = cE({type: "script", attr: [["src", urls[stateId]]]});
            document.body.appendChild(script);
            script.onload = () => {
                builder.debug("PassionPenguin/RailMapMaker", "builder.package.js", "Network", "Loaded Components: " + urls[stateId]);
                if (stateId > urls.length - 2) {
                    if (returnFunc !== undefined)
                        returnFunc();
                    builder.debug("PassionPenguin/RailMapMaker", "builder.package.js", "Network", "Components All Loaded");
                    return;
                }
                stateId++;
                importScript();
            }
        }
        importScript();
    }, importStyles: (urls) => {
        urls = typeof urls === "object" ? urls : [urls];
        urls.forEach(url => {
            document.head.appendChild(cE({type: "link", attr: [["rel", "stylesheet"], ["href", url]]}))
        })
    }
}