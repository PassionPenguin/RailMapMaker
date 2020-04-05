/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const LineEditorComp = {
    showLineEditor: () => {
        let editor = cE({type: "div", attr: [["id", "pg-lineEditor"]]});
        editor.appendChild(cE({
            type: "p",
            attr: [["style", "margin-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.selectLineDescription
        }));

        let lineContent = cE({type: "div", attr: [["id", "pg-lineContent"]]});
        editor.appendChild(lineContent);

        let selectLineGroup = cE({type: "div"});
        contentData.pathInfo.forEach(value => {
            selectLineGroup.appendChild(cE({
                type: "p",
                attr: [["style", ("margin-top:20px;font:14px/1 Anodina,sans-serif;color:" + (contentData.pathInfo[state.pathId] === value ? "var(--theme800);" : "var(--grey);"))]],
                innerText: value.name, onclick: (event) => {
                    pg.$("#selectLine_newPathToggle")[0].setAttribute("selected", "false");
                    state.newPath = false;
                    state.pathId = value.id;
                    LineEditorComp.showLineContent(value.id, lineContent);
                    [...selectLineGroup.children].filter(i => i.style.color === "var(--theme800)").forEach(ele => {
                        ele.style.color = "var(--grey)"
                    });
                    event.target.style.color = "var(--theme800)";
                }
            }));
        });
        editor.appendChild(selectLineGroup);
        editor.appendChild(cE({
            type: "p",
            attr: [["style", "padding-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.orCreateNewPathDescription
        }));
        editor.appendChild(cE({
            type: "pg-switchToggle",
            attr: [["style", "font:14px/1 Anodina,sans-serif;color:var(--grey)"], ["on_valueChange", "(val)=>{val==='true'?state.newPath=true:state.newPath=false;}"], ["id", "selectLine_newPathToggle"]]
        }));

        if (MediaQuery.screenWidth().includes("xlg"))
            WindowManager.create((view) => {
                pg.$("#scroll-use")[0].style.left = "320px";
                pg.$("#scroll-use")[0].style.right = "0";
                pg.$("#scroll-use")[0].style.width = "calc(100vw - 320px)";
                view.appendChild(editor);
            }, {
                withMask: "none",
                withBlur: "none",
                size: "extraSmall",
                mode: "vertical_split",
                alignment: "vertical_center horizontal_left", onQuit: () => {
                    pg.$("#scroll-use")[0].style.left = "unset";
                    pg.$("#scroll-use")[0].style.right = "unset";
                    pg.$("#scroll-use")[0].style.width = "unset";
                },
                title: strings.edit
            });
        else if (MediaQuery.screeHeight().includes("xlg"))
            WindowManager.create((view) => {
                pg.$("#scroll-use")[0].style.bottom = "320px";
                pg.$("#scroll-use")[0].style.top = "0";
                pg.$("#scroll-use")[0].style.height = "calc(100vh - 320px)";
                view.appendChild(editor);
            }, {
                withMask: "none",
                withBlur: "none",
                size: "extraSmall",
                mode: "horizontal_split",
                alignment: "vertical_bottom horizontal_left", onQuit: () => {
                    pg.$("#scroll-use")[0].style.bottom = "unset";
                    pg.$("#scroll-use")[0].style.top = "unset";
                    pg.$("#scroll-use")[0].style.height = "unset";
                },
                title: strings.edit
            });
        else
            WindowManager.create((view) => {
                // editor.appendChild();
                view.appendChild(editor);
            }, {size: "medium", title: strings.edit});

        LineEditorComp.showLineContent(state.pathId, lineContent);
        PenguinUI_selector.init();
    },
    showLineContent: (id, e) => {
        e.innerHTML = "";
        state.pathId = id;
        let i = contentData.pathInfo[id];
        e.appendChild(cE({
            type: "p",
            attr: [["style", "margin-top:40px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.editLineDescription
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineName"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">edit</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.pathName}</span><input value="${i.name}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="[...pg.$('#pg-selectLine-selector')[0].children].filter(i => i.innerText === this.value||i.tagName==='SPAN').forEach(i => {i.innerText = this.value;});contentData.pathInfo[state.pathId].name = this.value;savePathComp.current();drawMap(state.pathId);">`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineCap"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">remove</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.lineCap}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[state.pathId].lineCap=['butt','round','square','inherit'][e];drawMap(state.pathId);savePathComp.current();}"><opt>${strings.buttStyle}</opt><opt>${strings.roundStyle}</opt><opt>${strings.squareStyle}</opt><opt>${strings.inheritStyle}</opt><span>${i.lineCap}</span></pg-selector>`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineJoin"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">border_style</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.lineJoin}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[state.pathId].lineJoin=['butt','round','square','inherit'][e];drawMap(state.pathId);savePathComp.current();}"><opt>${strings.buttStyle}</opt><opt>${strings.roundStyle}</opt><opt>${strings.squareStyle}</opt><opt>${strings.inheritStyle}</opt><span>${i.lineJoin}</span></pg-selector>`
        }));
        let strokeColor = cE({
            type: "div",
            attr: [["class", "pg-lineContent-strokeColor"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">format_paint</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/36px Anodina,sans-serif;margin:10px;">${strings.strokeColor}</span><span class="button" style="width:80px;display:inline-block;font:14px/36px Anodina,sans-serif;margin:10px;text-align:center;color:var(--dark);">${i.color}</span>`,
            onclick: () => {
                WindowManager.create((view, colorId) => {
                    colorUtils.getColor(view, i.color, null, (color) => {
                        WindowManager.remove(colorId);
                        strokeColor.children[2].innerText = color;
                        i.color = color;
                        drawMap(state.pathId);
                        savePathComp.current();
                    });
                    view.children[0].style.marginTop = "48px";
                }, {size: "medium", title: strings.strokeColor});
            }
        });
        e.appendChild(strokeColor);
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-strokeWidth"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">format_bold</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.strokeWidth}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[state.pathId].strokeWidth=['1px','2px','5px','10px'][e];drawMap(state.pathId);savePathComp.current();}"><opt>1px</opt><opt>2px</opt><opt>5px</opt><opt>10px</opt><span>${i.strokeWidth}</span></pg-selector>`
        }));
        PenguinUI_switchToggle.init();
        PenguinUI_selector.init();
    }
};