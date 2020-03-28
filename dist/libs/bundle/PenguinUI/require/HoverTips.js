/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const HoverTips = {
    query: [], // store the id of notifications
    create: (element, title, text) => {
        let e;
        element.onmouseover = () => {
            e = cE({
                type: "div",
                attr: [["class", "pg-tips"]]
            });
            let tmp = cE({
                type: "p",
                attr: [["style", "font:12px/1 Anodina,sans-serif;display:inline-block;margin:0;padding:0;opacity:0;"]],
                innerText: text
            });
            document.body.appendChild(tmp);
            let bcr = element.getBoundingClientRect(), left, top;
            if (bcr.x - (tmp.getBoundingClientRect().width + 50) < 0)
                left = bcr.x + bcr.width + 20;
            else left = bcr.x - (tmp.getBoundingClientRect().width + 50);
            if (bcr.y - 20 < 0)
                top = bcr.y + bcr.height + 20;
            else top = bcr.y - 20
            e.style.left = left + "px";
            e.style.top = top + "px";
            e.appendChild(cE({
                type: "div",
                attr: [["class", "pg-tips-title"]],
                innerText: title
            }));
            e.appendChild(cE({type: "div", attr: [["class", "pg-tips-text"]], innerText: text}));
            document.body.appendChild(e);
            document.body.removeChild(tmp);
        };
        element.onmouseout = () => {
            try {
                document.body.removeChild(e);
            } catch (e) {
            }
        }
        window.addEventListener("click", () => {
            try {
                document.body.removeChild(e);
            } catch (e) {
            }
        }, {once: true});
    }
};