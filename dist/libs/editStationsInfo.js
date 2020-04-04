/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const StationEditorComp = {
    showStationEditor: () => {
        let editor = cE({type: "div", attr: [["id", "pg-stationSelector"]]});
        editor.appendChild(cE({
            type: "h3",
            attr: [["style", "margin-top:20px;font:20px/1 Anodina,sans-serif;color:var(--dark);"]],
            innerText: strings.selectPath
        }));
        editor.appendChild(cE({
            type: "p",
            attr: [["style", "margin-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.selectLineDescription
        }));
        let selectStationGroup = cE({type: "div"});
        contentData.pathInfo.forEach(value => {
            selectStationGroup.appendChild(cE({
                type: "p",
                attr: [["style", ("margin-top:20px;font:14px/1 Anodina,sans-serif;color:" + (contentData.pathInfo[state.pathId] === value ? "var(--theme800);" : "var(--grey);"))]],
                innerText: value.name, onclick: (event) => {
                    pg.$("#selectStation_newPathToggle")[0].setAttribute("selected", "false");
                    state.newPath = false;
                    state.pathId = value.id;
                    loadStation();
                    [...selectStationGroup.children].filter(i => i.style.color === "var(--theme800)").forEach(ele => {
                        ele.style.color = "var(--grey)"
                    });
                    event.target.style.color = "var(--theme800)";
                    pg.$("#pg-stationEditor")[0].parentElement.removeChild(pg.$("#pg-stationEditor"));
                }
            }));
        });

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
                backStyle: "close"
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
                backStyle: "close"
            });
        else
            WindowManager.create((view) => {
                // editor.appendChild();
                view.appendChild(editor);
            }, {size: "medium"});

        let selector = cE({type: "div", attr: [["class", "selectStation"]]});
        const loadStation = () => {
            selector.innerHTML = "";
            contentData.pathInfo[state.pathId].stations.forEach((e, index) => {
                selector.appendChild(cE({
                    type: "div",
                    attr: [["style", "width:calc(100% - 20px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:14px/1 Anodina,sans-serif;margin:15px 10px;"]],
                    innerHTML: `<span style='color:var(--dark);'>${e.text.name[0]}</span>${e.text.type === "withSecondaryName" ? ("<span style='color:var(--grey);'>" + e.text.name[1] + "</span>") : ""}`,
                    onclick: () => {
                        StationEditorComp.showStationContent(state.pathId, index);
                    }
                }));
            });
            editor.appendChild(selector);
        };
        loadStation();

        PenguinUI_selector.init();
    },
    showStationContent: (id, index) => {
        let wrap = cE({type: "div", attr: [["id", "pg-stationEditor"]]});
        wrap.appendChild(cE({
            type: "h3",
            attr: [["style", "margin-top:20px;font:20px/1 Anodina,sans-serif;color:var(--dark);"]],
            innerText: strings.selectPath
        }));
        wrap.appendChild(cE({
            type: "p",
            attr: [["style", "margin-top:20px;font:14px/1 Anodina,sans-serif;color:var(--grey)"]],
            innerText: strings.editStationDescription
        }));


        let e = contentData.pathInfo[id].stations[index];

        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-lineContent-strokeWidth"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">translate</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.withSecondaryName}</span><pg-switchToggle style="font:14px/1 Anodina,sans-serif;color:var(--grey)" on_valueChange="(val)=>{val==='true'?contentData.pathInfo[${id}].stations[${index}].text.type='withSecondaryName':contentData.pathInfo[${id}].stations[${index}].text.type='singleNameOnly';StationEditorComp.showStationContent('${id}','${index}');document.body.removeChild(pg.$('#pg-stationEditor')[0].parentElement.parentElement);drawMap(${id});savePathComp.current();}" selected="${e.text.type === "withSecondaryName"}"></pg-switchToggle>`
        }));

        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-firstName"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">text_fields</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.firstName}</span><input value="${e.text.name[0]}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.pathInfo[${id}].stations[${index}].text.name[0]=this.value;drawMap(${id});savePathComp.current();">`
        }));

        if (e.text.type === "withSecondaryName")
            wrap.appendChild(cE({
                type: "div",
                attr: [["class", "pg-stationContent-secondaryName"], ["style", "margin:10px;"]],
                innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">text_fields</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.secondaryName}</span><input value="${e.text.name[1]}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.pathInfo[${id}].stations[${index}].text.name[0]=this.value;drawMap(${id});savePathComp.current();">`
            }));
        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-xValue"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">trip_origin</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.xValue}</span><input value="${e.x}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.pathInfo[${id}].stations[${index}].x=Int(this.value);drawMap(${id});savePathComp.current();" type="number">`
        }));
        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-yValue"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">trip_origin</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.yValue}</span><input value="${e.y}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.pathInfo[${id}].stations[${index}].y=Int(this.value);drawMap(${id});savePathComp.current();" type="number">`
        }));
        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-style"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">category</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.style}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[${id}].stations[${index}].stationStyle=['rect','circle'][e];drawMap(${id});savePathComp.current();}"><opt>rect</opt><opt>circle</opt><span>${e.stationStyle}</span></pg-selector>`
        }));
        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-style"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">style</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.namePosition}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[${id}].stations[${index}].text.position=Int(e);drawMap(${id});savePathComp.current();}"><opt>${strings.topLeft}</opt><opt>${strings.top}</opt><opt>${strings.topRight}</opt><opt>${strings.left}</opt><opt>${strings.right}</opt><opt>${strings.bottomLeft}</opt><opt>${strings.bottomRight}</opt><span>${[strings.topLeft, strings.top, strings.topRight, strings.left, strings.right, strings.bottomLeft, strings.bottom, strings.bottomRight][e.text.position]}</span></pg-selector>`
        }));
        wrap.appendChild(cE({
            type: "div",
            attr: [["class", "pg-stationContent-style"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">format_align_left</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.align}</span><pg-selector style="width:80px;text-align:center;" on_valueChange="(e)=>{contentData.pathInfo[${id}].stations[${index}].text.alignment=['start', 'middle', 'end'][Int(e)];drawMap(${id});savePathComp.current();}"><opt>${strings.left}</opt><opt>${strings.middle}</opt><opt>${strings.right}</opt><span>${[strings.left, strings.middle, strings.right][['start', 'middle', 'end'].indexOf(e.text.alignment)]}</span></pg-selector>`
        }));
        let removeNode = cE({
            type: "div",
            attr: [["class", "pg-stationContent-remove"], ["style", "margin:10px;"]],
            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">delete</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.remove}</span>`
        });
        removeNode.appendChild(cE({
            type: "span",
            attr: [["class", "button"], ["style", "display:inline-block;text-align:center;width:100px;margin:0;"]],
            innerHTML: strings.remove,
            onclick: () => {
                WindowManager.create((view, channelId) => {
                    view.appendChild(cE({
                        type: "div",
                        attr: [["style", "font:18px/1 Anodina,sans-serif;margin:20px 20px 0 20px;"]],
                        innerHTML: strings.confirm
                    }));
                    view.appendChild(cE({
                        type: "div",
                        attr: [["style", "text-align:center;font:14px/1 Anodina,sans-serif;margin:10px 20px;"]],
                        innerHTML: strings.confirmRemoveNode
                    }));
                    let bottomSelector = cE({
                        type: "div",
                        attr: [["style", "display:block;width:calc(100% - 40px);height:48px;position: fixed;bottom: 0;z-index: 1001;"]]
                    });
                    bottomSelector.appendChild(cE({
                        type: "button",
                        attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;color:var(--theme);"]],
                        innerText: strings.remove,
                        onclick: () => {
                            contentData.pathInfo[id].stations.splice(index, 1);
                            if (index === 0 || index === contentData.pathInfo[id].stations.length - 1) {
                                contentData.pathInfo[id].stations[0].type = "destination";
                                contentData.pathInfo[id].stations.last().type = "destination";
                            }
                            drawMap(id);
                            savePathComp.current();
                            WindowManager.remove(channelId)
                        }
                    }));
                    bottomSelector.appendChild(cE({
                        type: "button",
                        attr: [["style", "border:none!important;width:fit-content;float:right;display:inline-block;line-height:30px!important;"], ["class", "button"]],
                        innerText: strings.cancel, onclick: () => WindowManager.remove(channelId)
                    }));
                    view.appendChild(bottomSelector);
                }, {size: "small", backStyle: "close"});
            }
        }));
        wrap.appendChild(removeNode);


        if (MediaQuery.screenWidth().includes("xlg"))
            WindowManager.create((view) => {
                pg.$("#scroll-use")[0].style.left = "640px";
                pg.$("#scroll-use")[0].style.right = "0";
                pg.$("#scroll-use")[0].style.width = "calc(100vw - 640px)";
                view.appendChild(wrap);
                view.setAttribute("style", "left:320px");
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
                backStyle: "close",
                zIndex: 999
            });
        else if (MediaQuery.screeHeight().includes("xlg"))
            WindowManager.create((view) => {
                pg.$("#scroll-use")[0].style.bottom = "640px";
                pg.$("#scroll-use")[0].style.top = "0";
                pg.$("#scroll-use")[0].style.height = "calc(100vh - 640px)";
                view.appendChild(wrap);
                view.setAttribute("style", "bottom:320px");
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
                backStyle: "close",
                zIndex: 999
            });
        else
            WindowManager.create((view) => {
                // editor.appendChild();
                view.appendChild(wrap);
            }, {size: "medium", zIndex: 999});
        PenguinUI_switchToggle.init();
        PenguinUI_selector.init();
    }
};