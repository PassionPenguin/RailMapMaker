/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const selectLineDialog = () => {
    WindowManager.create((view, channelId) => {
        view.appendChild(cE({
            type: "h3",
            attr: [["style", "margin-top:20px;font:20px/1 Anodina,sans-serif;color:var(--dark);"]],
            innerText: strings.selectLine
        }));
        view.appendChild(cE({
            type: "p",
            attr: [["style", "margin-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.selectLineDescription
        }));
        pathInfo.forEach(value => {
            view.appendChild(cE({
                type: "p",
                attr: [["style", "margin-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
                innerText: value.name, onclick: () => {
                    pg.$("#selectLine_newPathToggle")[0].setAttribute("selected", "false");
                    state.newPath = false;
                    state.pathId = value.id
                    WindowManager.remove(channelId);
                }
            }));
        });
        view.appendChild(cE({
            type: "p",
            attr: [["style", "padding-top:20px;font:13px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.orCreateNewPathDescription
        }));
        view.appendChild(cE({
            type: "pg-switchToggle",
            attr: [["style", "font:14px/1 Anodina,sans-serif;color:var(--grey)"], ["on_valueChange", "(val)=>{val==='true'?state.newPath=true:state.newPath=false;}"], ["id", "selectLine_newPathToggle"]]
        }));
        PenguinUI_switchToggle.init();
    }, {size: "middle"});
}