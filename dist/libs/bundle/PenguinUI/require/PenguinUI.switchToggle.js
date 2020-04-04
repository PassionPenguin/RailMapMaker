/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

PenguinUI_switchToggle = {
    init: () => {
        [...pg.$("pg-switchToggle:not([pg-init])")].forEach(e => {
            if (e.getAttribute('selected') !== "true")
                e.setAttribute("selected", "false");
            let curValue = cE({type: "span"});
            e.appendChild(curValue);
            e.onclick = () => {
                if (e.getAttribute("selected") === "false")
                    e.setAttribute("selected", "true");
                else
                    e.setAttribute("selected", "false");
                if (e.getAttribute("on_valueChange") !== undefined)
                    eval(e.getAttribute("on_valueChange"))(e.getAttribute("selected"));
            }
            e.setAttribute("pg-init", "true");
        });
    }
};