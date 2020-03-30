/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const builder = {
    debugMode: true,
    version: "1.0",
    bundles: [{name: "PenguinUI", version: "0.1.4"}],
    displayVersion: "Lemonade/(RMG v0.1 EAP)",
    locales: ["zh_CN", "zh_HK", "zh_YUE", "en_US"],
    buildTime: 1585118965574,
    debug: (pkg, src, tag, msg) => {
        if (builder.debugMode)
            console.debug("%c> " + pkg + "%c>> " + src + "%c\n" + tag + ":\t %c" + msg, "color:var(--grey);margin:10px auto 0 auto;display:block;font:900 12px/1 Anodina,sans-serif;", "color:var(--black);margin:0 auto 20px auto;display:block;font:900 14px/1 Anodina,sans-serif;", "color:var(--black);margin:10px 20px 0 0;display:context;font:14px/21px Anodina,sans-serif;", "color:var(--black);margin:0;display:context;font:12px/21px Anodina,sans-serif;");
    }, init: (returnFunc) => {
        builder.debug("PassionPenguin/RailMapMaker", "builder.package.js", "Network", "loaded script: build.package.js");

        window.state = {
            newPath: true,
            pathId: -1, currentNode: "editingStations", stationStyle: "rect"
        };

        window.contentData = null;

        window.pathInfo = [];

        if (CookieManager.get("language") === "" || isNaN(Int(CookieManager.get("language"))))
            pg.language = 0;
        else pg.language = Int(CookieManager.get("language"));

        ProgressManager.update(0, 25, 100);

        builder.importStyles(["./dist/libs/bundle/PenguinUI/bundle.PenguinUI.css", "./dist/libs/bundle/storyboard/bundle.storyboard.css"]);
        ProgressManager.update(0, 33.3, 100);
        builder.importScripts(["./dist/libs/attachWindowCursorEvent.js", "./dist/libs/initInterface.js", "./dist/libs/lineEditorComp.js", "./dist/libs/exportDrawable.js", "./dist/libs/drawMap.js", "./dist/libs/selectLineDialog.js", "./assets/locales/" + builder.locales[pg.language] + ".js"], returnFunc);
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