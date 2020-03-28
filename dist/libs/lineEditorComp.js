/*

    Package PassionPenguin/RailMapMaker

    
    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const showLineEditor = (e, id) => {
    document.body.appendChild(cE({
        type: "div",
        attr: [["id", "lineEditorPromptMask"], ["style", "position:fixed;left:0;top:0;width:100%;height:100%;background:#00000022;z-index:1;"]],
        onclick: () => {
            document.body.removeChild(lineEditorPrompt);
            document.body.removeChild(pg.$("#lineEditorPrompt")[0]);
        }
    }));
    let lineEditorPrompt = cE({type: "div", attr: [["id", "lineEditorPrompt"]]});
    lineEditorPrompt.appendChild(cE({
        type: "p",
        attr: [["class", "typeInfo"]],
        innerHTML: "样式"
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorColorPicker"]],
        innerHTML: "填色\t\t<span style='width: 20px;height: 20px;display: inline-block;vertical-align: middle;border: 1px solid var(--white);background-color: " + pathInfo[id].color + "'></span>",
        // colorPickerFeature
        onclick: () => {
            // U.C.
        }
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorColorPicker"]],
        innerHTML: "不透明度\t\t<span style='width: 20px;height: 20px;display: inline-block;vertical-align: middle;border: 1px solid var(--white);background: url(./assets/mipmap/opacity.png);opacity:" + pathInfo[id].opacity + "'></span>",
        // transparentPickerFeature
        onclick: () => {
            // U.C.
        }
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorColorPicker"]],
        innerHTML: "边角\t\t<span style='width: 20px;height: 20px;display: inline-block;vertical-align: middle;border: 1px solid var(--white);background: url(./assets/mipmap/border.png);opacity:" + pathInfo[id].opacity + "'></span>",
        // transparentPickerFeature
        onclick: () => {
            // U.C.
        }
    }));
    lineEditorPrompt.appendChild(cE({
        type: "p",
        attr: [["class", "typeInfo"]],
        innerHTML: "数据"
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorNameInput"]],
        innerHTML: "名称\t\t<span>" + pathInfo[id].name + "</span>",
        // namePickerFeature
        onclick: () => {
            // U.C.
        }
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorNameInput"]],
        innerHTML: "编号\t\t<span>" + id + "</span>",
        // idInfoFeature
        onclick: () => {
            // U.C.
        }
    }));
    lineEditorPrompt.appendChild(cE({
        type: "button",
        attr: [["id", "lineEditorColorPicker"]],
        innerHTML: "站点\t\t<span style='width: 20px;height: 20px;display: inline-block;vertical-align: middle;border: 1px solid var(--white);background: url(./assets/mipmap/border.png);opacity:" + pathInfo[id].opacity + "'></span>",
        // transparentPickerFeature
        onclick: () => {
            // U.C.
        }
    }));
    document.body.appendChild(lineEditorPrompt);
};