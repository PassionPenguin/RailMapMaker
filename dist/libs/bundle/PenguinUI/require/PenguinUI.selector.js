/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

PenguinUI_selector = {
    init: () => {
        [...pg.$("pg-selector:not([pg-init])")].forEach(e => {
            let curValue;
            if ([...e.children].filter(i => i.tagName === 'SPAN').length !== 0) curValue = [...e.children].filter(i => i.tagName === 'SPAN')[0];
            else {
                curValue = cE({type: "span", innerHTML: e.children[0].innerHTML});
                e.appendChild(curValue);
            }
            let clicked = false, displayingDialog = false;
            let selectors = cE({
                type: "div",
                attr: [["style", "display:block;position:fixed;z-index:1002;padding:0!important;margin:0!important;border-radius:5px;user-select:none;"], ["class", "pg-tips pg-selectors"]]
            });
            e.onclick = () => {
                selectors.innerHTML = "";
                if (clicked) {
                    clicked = false;
                    displayingDialog = false;
                    document.body.removeChild(selectors);
                } else {
                    displayingDialog = false;
                    let bcr = e.getBoundingClientRect(), left, top;
                    if (bcr.x - 50 < 0)
                        left = bcr.x + bcr.width + 20;
                    else left = bcr.x - 50;
                    if (bcr.y - 20 < 0)
                        top = bcr.y + bcr.height + 20;
                    else top = bcr.y - 20
                    selectors.style.left = left + "px";
                    selectors.style.top = top + "px";
                    document.body.appendChild(selectors);
                    let listener;
                    [...e.querySelectorAll("opt")].map(i => i.innerHTML).forEach((value, index) => {
                        selectors.appendChild(cE({
                            type: "div",
                            attr: [["style", "border-radius:5px;padding: 10px;text-align: center;display:block;margin:" + ((e.querySelectorAll("opt").length === index + 1) ? "5px auto 10px auto" : index === 0 ? "10px auto 5px auto" : "5px auto") + ";font: 14px/1 Anodina,sans-serif;"]],
                            onclick: (event) => {
                                event.stopPropagation();
                                clicked = false;
                                displayingDialog = false;
                                curValue.innerHTML = value;
                                if (e.getAttribute("on_valueChange") !== -1)
                                    setTimeout(() => {
                                        try {
                                            eval(e.getAttribute("on_valueChange"))(index.toString());
                                        } catch (e) {
                                        }
                                    }, 500);
                                e.setAttribute("pg-selected", index);
                                document.body.removeChild(selectors);
                                try {
                                    window.removeEventListener(listener);
                                    setTimeout(() => {
                                        window.removeEventListener(listener);
                                    }, 500);
                                } catch (exception) {
                                }
                            }, innerHTML: value
                        }));
                    });
                    setTimeout(() => {
                        listener = window.addEventListener('click', () => {
                            if (clicked && displayingDialog) {
                                clicked = false;
                                displayingDialog = false;
                                document.body.removeChild(selectors);
                            }
                        }, {once: true});
                    }, 500);
                    clicked = true;
                }
            }
            e.setAttribute("pg-init", "true");
        });
    }
};