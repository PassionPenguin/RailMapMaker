/*

    Package PassionPenguin/mapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const builder = {
    debugMode: true,
    version: "1.0",
    displayVersion: "Lemonade/(RMG v0.1 EAP)",
    debug: (pkg, src, tag, msg) => {
        console.debug("%c> " + pkg + "%c>> " + src + "%c\n" + tag + ":\t %c" + msg, "color:var(--grey);margin:10px auto 0 auto;display:block;font:900 12px/1 Anodina,sans-serif;", "color:var(--black);margin:0 auto 20px auto;display:block;font:900 14px/1 Anodina,sans-serif;", "color:var(--black);margin:10px 20px 0 0;display:context;font:14px/21px Anodina,sans-serif;", "color:var(--black);margin:0;display:context;font:12px/21px Anodina,sans-serif;");
    }, init: (returnFunc) => {
        if (builder.debugMode)
            builder.debug("PassionPenguin/mapMaker", "builder.package.js", "Network", "loaded script: build.package.js");

        window.state = {
            newPath: true,
            pathId: -1, currentNode: "editingStations"
        };

        window.contentData = null;

        window.pathInfo = [];

        window.pg = {
            $: (e) => {
                return document.querySelectorAll(e);
            }
        };

        window.Int = (val) => {
            return parseInt(val)
        };

        window.cE = (data) => {
            if (data === undefined)
                data = {type: "div", attr: [], innerText: undefined, innerHTML: undefined, onclick: undefined}
            let e = document.createElement(data.type);
            if (data.attr !== undefined)
                data.attr.forEach((attr) => {
                    e.setAttribute(attr[0], attr[1]);
                });
            if (data.innerText !== undefined)
                e.innerText = data.innerText;
            if (data.innerHTML !== undefined)
                e.innerHTML = data.innerHTML;
            if (data.onclick !== undefined)
                e.onclick = (e) => {
                    data.onclick(e)
                };
            return e;
        };

        window.min = (val) => {
            return val % 25 > 12.5 ? val + (25 - val % 25) : val - val % 25;
        };

        if (!Array.prototype.last) {
            Array.prototype.last = function () {
                return this[this.length - 1];
            }
        }

        builder.importStyles(["./dist/libs/bundle/PenguinUI/bundle.PenguinUI.css", "./dist/libs/bundle/storyboard/bundle.storyboard.css"]);
        builder.importScripts(["./dist/libs/attachWindowCursorEvent.js", "./dist/libs/lineEditorComp.js", "./dist/libs/mapDrawer.js","./dist/libs/bundle/PenguinUI/bundle.PenguinUI.js"], returnFunc);
    },
    importScripts: (urls, returnFunc) => {
        // urls=>array/string
        if (builder.debugMode)
            builder.debug("PassionPenguin/mapMaker", "builder.package.js", "Network", "Importing Components Session Started");
        urls = typeof urls === "object" ? urls : [urls];
        let stateId = 0;
        let importScript = () => {
            let script = cE({type: "script", attr: [["src", urls[stateId]]]});
            document.body.appendChild(script);
            script.onload = () => {
                if (builder.debugMode)
                    builder.debug("PassionPenguin/mapMaker", "builder.package.js", "Network", "Loaded Components: " + urls[stateId]);
                if (stateId > urls.length - 2) {
                    if (returnFunc !== undefined)
                        returnFunc();
                    if (builder.debugMode)
                        builder.debug("PassionPenguin/mapMaker", "builder.package.js", "Network", "Components All Loaded");
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