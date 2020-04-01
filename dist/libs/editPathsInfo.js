/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const LineEditorComp = {
    showLineEditor: (id) => {
        id = id || 0;
        let editor = cE({type: "div", attr: [["id", "pg-lineEditor"]]});
        editor.appendChild(cE({
            type: "h3",
            attr: [["style", "margin-top:20px;font:20px/1 Anodina,sans-serif"]],
            innerText: strings.editPathsInfo
        }));

        let selectLineWrap = cE({
            type: "div",
            attr: [["style", "width:fit-content;padding:0 10px;display:inline-block;margin-bottom:20px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">mouse</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.selectPath}</span>`
        });
        let selectLine = cE({
            type: "pg-selector",
            attr: [["style", "width:fit-content;padding: 10px 20px;display: inline-block"], ["id", "selectLine"], ["on_valueChange", "(e)=>{LineEditorComp.showLineContent(e,pg.$('#pg-lineContent')[0])}"], ["id", "pg-selectLine-selector"]]
        });
        contentData.pathInfo.forEach(e => {
            selectLine.appendChild(cE({type: "opt", innerText: e.name}));
        });
        selectLine.appendChild(cE({type: "span", innerText: contentData.pathInfo[state.pathId].name}));
        selectLineWrap.appendChild(selectLine);
        editor.appendChild(selectLineWrap);

        let lineContent = cE({type: "div", attr: [["id", "pg-lineContent"]]});
        editor.appendChild(lineContent);

        if (MediaQuery.screenWidth().includes("lg") && MediaQuery.screeHeight().includes("lg"))
            document.body.appendChild(editor);
        WindowManager.create((view, channelId) => {
            // editor.appendChild();
            view.appendChild(editor);
        });

        LineEditorComp.showLineContent(id, lineContent);
        PenguinUI_selector.init();
    }, showLineContent: (id, e) => {
        e.innerHTML = "";
        state.pathId = id;
        let i = contentData.pathInfo[id];
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineName"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">edit</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.pathName}</span><input value="${i.name}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;" oninput="contentData.pathInfo[state.pathId].name=this.value;drawMap(state.pathId);pg.$('pg-selectLine-selector')[0].children.filter((i,index)=>i.tagName==='span'||index===e).forEach(i=>{i.innerText=this.value})">`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineCap"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">remove</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.lineCap}</span><pg-selector on_valueChange="(e)=>{contentData.pathInfo[state.pathId].lineCap=['butt','round','square','inherit'][e];drawMap(state.pathId);}"><opt>${strings.buttStyle}</opt><opt>${strings.roundStyle}</opt><opt>${strings.squareStyle}</opt><opt>${strings.inheritStyle}</opt><span>${i.lineCap}</span></pg-selector>`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-lineJoin"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">border_style</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.lineJoin}</span><pg-selector on_valueChange="(e)=>{contentData.pathInfo[state.pathId].lineJoin=['butt','round','square','inherit'][e];drawMap(state.pathId);}"><opt>${strings.buttStyle}</opt><opt>${strings.roundStyle}</opt><opt>${strings.squareStyle}</opt><opt>${strings.inheritStyle}</opt><span>${i.lineJoin}</span></pg-selector>`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-strokeColor"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">format_paint</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.strokeColor}</span>`
        }));
        e.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-strokeWidth"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">format_bold</span><span style="width:120px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.strokeWidth}</span><pg-selector on_valueChange="(e)=>{contentData.pathInfo[state.pathId].strokeWidth=['1px','2px','5px','10px'][e];drawMap(state.pathId);}"><opt>1px</opt><opt>2px</opt><opt>5px</opt><opt>10px</opt><span>${i.strokeWidth}</span></pg-selector>`
        }));
        PenguinUI_selector.init();
    }
};