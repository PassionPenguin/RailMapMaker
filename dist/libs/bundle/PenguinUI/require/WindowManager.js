/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const WindowManager = {
    create: (returnFunc) => {
        let WindowFrame = cE({type: "div", attr: [["class", "pg-window"]]});
        let content = cE({type: "div", attr: [["class", "pg-window-content"]]});
        document.body.appendChild(WindowFrame);
        WindowFrame.appendChild(content);
        content.appendChild(cE({
            type: "span", attr: [["class", "pg-window-close mi"]], innerText: "close", onclick: () => {
                WindowFrame.classList.add("remove");
                setTimeout(() => {
                    document.body.removeChild(WindowFrame);
                }, 500);
            }
        }));
        returnFunc(content);
    }
};