/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const WindowManager = {
    query: [],
    create: (returnFunc, opt) => {
        opt = opt || {};
        opt.mode = opt.mode || "default";
        opt.size = opt.size || "medium";
        opt.zIndex = opt.zIndex || "1000";
        opt.withMask = opt.withMask || "true";
        opt.withBlur = opt.withBlur || "true";
        opt.alignment = opt.alignment || "center";
        opt.channelId = opt.channelId || WindowManager.query.length;
        opt.onQuit = opt.onQuit || (() => {
        });
        WindowManager.query.push(opt.channelId);
        let WindowFrame = cE({
            type: "div",
            attr: [["class", `pg-window ${opt.size} ${opt.mode} ${opt.alignment}`], ["style", `z-index: ${opt.zIndex}`], ["windowId", opt.channelId]]
        });
        let WindowMask;
        if (opt.withMask !== "none") WindowMask = cE({
            type: "div",
            attr: [["class", "pg-window pg-window-mask"], ["style", `z-index: ${Int(opt.zIndex) - 1};position:fixed;left:0;top:0;`], ["maskId", opt.channelId]],
            onclick: () => {
                WindowManager.remove(opt.channelId);
            }
        });
        let content = cE({type: "div", attr: [["class", "pg-window-content"]]});
        document.body.appendChild(WindowFrame);
        if (opt.withMask !== "none")
            document.body.appendChild(WindowMask);
        if (opt.withBlur !== "none")
            pg.$("#pg-app")[0].style.filter = "blur(10px)";
        WindowFrame.appendChild(content);
        content.appendChild(cE({
            type: "span", attr: [["class", "pg-window-close mi"]], innerText: "close",
            onclick: () => {
                WindowManager.remove(opt.channelId);
                opt.onQuit();
            }
        }));
        returnFunc(content, opt.channelId);
    }, remove: (channelId) => {
        pg.$(`[windowId='${channelId}']`)[0].classList.add("remove");
        setTimeout(() => {
            document.body.removeChild(pg.$(`[windowId='${channelId}']`)[0]);
            try {
                document.body.removeChild(pg.$(`[maskId='${channelId}']`)[0]);
            } catch (e) {
            }
            pg.$("#pg-app")[0].style.filter = "";
        }, 500);
        WindowManager.query.filter(i => i !== channelId);
    }
};