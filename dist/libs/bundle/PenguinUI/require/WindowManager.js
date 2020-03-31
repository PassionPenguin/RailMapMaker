/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const WindowManager = {
    query: [],
    create: (returnFunc, opt) => {
        opt = opt || {};
        opt.size = opt.size || "middle";
        opt.zIndex = opt.zIndex || "1000";
        opt.channelId = opt.channelId || WindowManager.query.length;
        let WindowFrame = cE({
            type: "div",
            attr: [["class", `pg-window ${opt.size}`], ["style", `z-index: ${opt.zIndex}`], ["windowId", opt.channelId]]
        });
        let WindowMask = cE({
            type: "div",
            attr: [["class", "pg-window pg-window-mask"], ["style", `z-index: ${Int(opt.zIndex) - 1}`], ["maskId", opt.channelId]],
            onclick: () => {
                WindowManager.remove(opt.channelId);
            }
        });
        let content = cE({type: "div", attr: [["class", "pg-window-content"]]});
        document.body.appendChild(WindowFrame);
        document.body.appendChild(WindowMask);
        pg.$("#pg-app")[0].style.filter = "blur(10px)";
        WindowFrame.appendChild(content);
        content.appendChild(cE({
            type: "span", attr: [["class", "pg-window-close mi"]], innerText: "close",
            onclick: () => {
                WindowManager.remove(opt.channelId);
            }
        }));
        returnFunc(content, opt.channelId);
    }, remove: (channelId) => {
        pg.$(`[windowId='${channelId}']`)[0].classList.add("remove");
        setTimeout(() => {
            document.body.removeChild(pg.$(`[windowId='${channelId}']`)[0]);
            document.body.removeChild(pg.$(`[maskId='${channelId}']`)[0]);
            pg.$("#pg-app")[0].style.filter = "";
        }, 500);
    }
};