/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const WindowManager = {
    create: (returnFunc, opt) => {
        opt = opt || {};
        opt.size = opt.size || "middle";
        opt.zIndex = opt.zIndex || "1000";
        let WindowFrame = cE({
            type: "div",
            attr: [["class", `pg-window ${opt.size}`], ["style", `z-index: ${opt.zIndex}`]]
        });
        let WindowMask = cE({
            type: "div",
            attr: [["class", "pg-window pg-window-mask"], ["style", `z-index: ${Int(opt.zIndex) - 1}`]],
            onclick: () => {
                WindowFrame.classList.add("remove");
                setTimeout(() => {
                    document.body.removeChild(WindowFrame);
                    document.body.removeChild(WindowMask);
                    pg.$("#pg-app")[0].style.filter = "";
                }, 500);
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
                WindowFrame.classList.add("remove");
                setTimeout(() => {
                    document.body.removeChild(WindowFrame);
                    document.body.removeChild(WindowMask);
                    pg.$("#pg-app")[0].style.filter = "";
                }, 500);
            }
        }));
        returnFunc(content);
    }
};