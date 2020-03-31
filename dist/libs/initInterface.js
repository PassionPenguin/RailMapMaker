/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initInterface = (type, returnFunc) => {
    /*
    * type: Int
        * 0 => Enter interface
        * 1 => Editor interface
    * */

    if (ProgressManager.query.indexOf(0) !== -1)
        ProgressManager.update(0, 66.6, 100);
    else ProgressManager.create(0, 0, 100);
    let view = pg.$("#pg-app")[0];
    if (type === 0) {
        // enter interface
        let storyboard = cE({type: "div", attr: [["class", "pg-storyboard"]]});
        let storyboardFileList = cE({type: "div", attr: [["class", "pg-storyboard-fileList"]]});
        let storyboardFileListContent = cE({
            type: "div",
            attr: [["style", "position:relative;width:100%;height:100%;"]]
        });
        JSONParser(LocaleStorageManager.get("fileList")).then(val => {
            (val.length === 0) ? storyboardFileListContent.appendChild(cE({
                type: "span",
                attr: [["style", "left:50%;top:50%;transform:translate(-50%,-50%);position:absolute;display:inline-block;font:24px/1 Anodina,sans-serif;color:var(--grey);"]],
                innerHTML: strings.noFile
            })) : val.forEach(e => {
                JSONParser(LocaleStorageManager.get('fileData_' + e)).then(i => {
                    storyboardFileListContent.appendChild(cE({
                        type: "div", attr: [["class", "pg-storyboard-file"]],
                        innerHTML: `<p class='fileName'>${i.name}</p><span class='fileMeta'>${new Date(i.lastModified).toLocaleString()} | ${i.author} </span>`,
                        onclick: () => {
                            window.contentData = i;
                            initInterface(1);
                            initDrawable();
                        }
                    }))
                });
            });
        });
        storyboardFileList.appendChild(storyboardFileListContent);
        view.appendChild(storyboard);
        view.appendChild(storyboardFileList);
        storyboard.appendChild(cE({
            type: "div",
            attr: [["class", "pg-storyboard-banner"]],
            innerHTML: "<img src='./assets/mipmap/icon.png' alt='icon'><h1>" + strings.appName + "</h1><h3>" + strings.version + " " + builder.displayVersion + "</h3>"
        }));
        let storyboardCtrlList = cE({
            type: "div",
            attr: [["class", "pg-storyboard-list"]]
        });
        storyboard.appendChild(storyboardCtrlList);
        storyboardCtrlList.appendChild(cE({
            type: "p",
            attr: [["class", "xlg-exclude"], ["style", "margin-top: 20px!important;"]],
            innerHTML: "<span class='mi'>folder</span><span> " + strings.recentFiles + " </span>",
            onclick: () => {
                // open preference window
                WindowManager.create(view => {
                    let popup_storyboardFileList = cE({type: "div", attr: [["class", "pg-storyboard-fileList"]]});
                    let popup_storyboardFileListContent = cE({
                        type: "div",
                        attr: [["style", "position:relative;width:100%;height:100%;"]]
                    });
                    popup_storyboardFileListContent.appendChild(cE({
                        type: "div",
                        attr: [["class", "pg-storyboard-file-title"], ["style", "    width: fit-content;margin: 10px!important;font: 300 20px/1 Anodina,sans-serif;color: var(--dark);"]],
                        innerHTML: strings.recentFiles,
                    }));
                    JSONParser(LocaleStorageManager.get("fileList")).then(val => {
                        (val.length === 0) ? popup_storyboardFileListContent.appendChild(cE({
                            type: "span",
                            attr: [["style", "left:50%;top:50%;transform:translate(-50%,-50%);position:absolute;display:inline-block;font:24px/1 Anodina,sans-serif;color:var(--grey);"]],
                            innerHTML: strings.noFile
                        })) : val.forEach(e => {
                            JSONParser(LocaleStorageManager.get('fileData_' + e)).then(i => {
                                popup_storyboardFileListContent.appendChild(cE({
                                    type: "div", attr: [["class", "pg-storyboard-file"]],
                                    innerHTML: `<p class='fileName' style="font-weight:600;font-size:18px;">${i.name}</p><span class='fileMeta'>${new Date(i.lastModified).toLocaleString()} | ${i.author} </span>`,
                                    onclick: () => {
                                        window.contentData = i;
                                        initInterface(1);
                                        initDrawable();
                                    }
                                }));
                            });
                        });
                    });
                    popup_storyboardFileList.appendChild(popup_storyboardFileListContent);
                    view.appendChild(popup_storyboardFileList);
                }, {size: "large"});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>attachment</span><span> " + strings.importFile + " (*.rmg) </span>",
            onclick: () => {
                // upload an rmg file
                let file = cE({type: "input", attr: [["type", "file"], ["accept", ".rmg"]]});
                file.click();
                file.onchange = () => {
                    let fileContent = file.files[0];
                    if (fileContent.name.substring(fileContent.name.lastIndexOf(".")) !== ".rmg") {
                        return;
                    }
                    let reader = new FileReader();
                    reader.readAsText(fileContent);
                    reader.onload = () => {
                        window.contentData = {
                            content: reader.result,
                            size: fileContent.size,
                            name: fileContent.name,
                            lastModified: fileContent.lastModified, type: fileContent.type
                        };
                        NotificationManager.create(strings.system, strings.uploaded + " <span class='color-primary'>" + fileContent.name + "</span>", 0, {
                            time: -1,
                            icon: "check"
                        });
                        try {
                            window.contentData = JSON.parse(reader.result.toString());
                            initInterface(1);
                            initDrawable();
                        } catch (e) {
                            NotificationManager.create(strings.system, strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + e, 0, {
                                time: -1,
                                icon: "close"
                            });
                            initInterface(0);
                        }
                    }
                }
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>dashboard</span><span> " + strings.openTemplate + "</span>",
            onclick: () => {
                state.fileId++;
                window.contentData = {
                    name: "Guangzhou Line 1", author: "Penguin", lastModified: new Date().getTime(),
                    pathInfo: [{
                        "lineCap": "round",
                        "lineJoin": "round",
                        "strokeWidth": "5px",
                        "color": "#000",
                        "id": 0,
                        "name": "UnnamedPath_0",
                        "opacity": 1,
                        "stations": [{"x": 225, "y": 1025, "type": "destination", "routeToNext": ""}, {
                            "x": 225,
                            "y": 900,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 225, "y": 775, "type": "common", "routeToNext": ""}, {
                            "x": 225,
                            "y": 650,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 225, "y": 525, "type": "common", "routeToNext": ""}, {
                            "x": 350,
                            "y": 525,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 475, "y": 525, "type": "common", "routeToNext": ""}, {
                            "x": 600,
                            "y": 525,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 725, "y": 525, "type": "common", "routeToNext": ""}, {
                            "x": 850,
                            "y": 525,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 975, "y": 525, "type": "common", "routeToNext": ""}, {
                            "x": 1100,
                            "y": 525,
                            "type": "common",
                            "routeToNext": ""
                        }, {"x": 1225, "y": 525, "type": "common", "routeToNext": ""}, {
                            "x": 1325,
                            "y": 425,
                            "type": "common",
                            "routeToNext": "3"
                        }, {"x": 1225, "y": 325, "type": "destination", "routeToNext": "2"}]
                    }]
                };
                JSONParser(LocaleStorageManager.get("fileList")).then(i => {
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length)
                    LocaleStorageManager.set("fileList", JSON.stringify(i));
                });
                initInterface(1, () => {
                    initDrawable();
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>open_in_new</span><span> " + strings.openNew + "</span>",
            onclick: () => {
                state.fileId++;
                JSONParser(LocaleStorageManager.get("fileList")).then(i => {
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length)
                    LocaleStorageManager.set("fileList", JSON.stringify(i));
                });
                window.contentData = {
                    name: "Untitled Project", author: "Unnamed User", lastModified: new Date().getTime(),
                    pathInfo: [{
                        stations: []
                    }]
                };
                initInterface(1, () => {
                    initDrawable();
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>info</span><span> " + strings.about + " </span>",
            onclick: () => {
                // open about window
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "img",
                        attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon.png"]]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                        innerHTML: strings.appName
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 10px 0 20px 0;color: var(--grey);"]],
                        innerHTML: strings.version + " " + builder.displayVersion
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.buildTime + "\t" + new Date(builder.buildTime).toLocaleDateString()
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curLanguage + "\t" + builder.locales[pg.language]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curMode + "\t" + ((builder.debugMode === 0) ? strings.production : strings.dev)
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.developer + "\t<a href='https://github.com/PassionPenguin'>@PassionPenguin</a> <a href='https://github.com/wongchito'>@wongchito</a>"
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: "Repo\t<a href='https://github.com/PassionPenguin/RailMapMaker'>RailMapMaker on GitHub</a>"
                    }));

                    builder.bundles.forEach(i => {
                        e.appendChild(cE({
                            type: "p",
                            attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                            innerHTML: "Bundle " + i.name + "\t" + i.version
                        }));
                    });
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>settings</span><span> " + strings.preference + " </span>",
            onclick: () => {
                // open preference window
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "img",
                        attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon.png"]]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                        innerHTML: strings.appName
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 20px 0;color: var(--grey);"]],
                        innerHTML: strings.preference
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curLanguage + "\t" + builder.locales[pg.language],
                        onclick: () => {
                            WindowManager.create((e) => {
                                e.appendChild(cE({
                                    type: "img",
                                    attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon.png"]]
                                }));
                                e.appendChild(cE({
                                    type: "p",
                                    attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                                    innerHTML: strings.appName
                                }));
                                e.appendChild(cE({
                                    type: "p",
                                    attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 20px 0;color: var(--grey);"]],
                                    innerHTML: strings.language
                                }));
                                let selector = cE({
                                    type: "pg-selector",
                                    attr: [["on_valueChange", "(e)=>{CookieManager.set('language',e);window.location.reload();}"], ["style", "    margin: 0 auto;display: block;width: 100px;text-align: center;"]]
                                });
                                e.appendChild(selector);
                                builder.locales.forEach((name, index) => {
                                    if (index === Int(CookieManager.get('language'))) selector.appendChild(cE({
                                        type: 'span',
                                        innerText: name
                                    }));
                                    selector.appendChild(cE({type: "opt", innerText: name}));
                                });
                                PenguinUI_selector.init();
                            });
                        }
                    }));
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>memory</span><span> " + strings.debugInfo + " </span>",
            onclick: () => {
                // open preference window
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "img",
                        attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon.png"]]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                        innerHTML: strings.appName
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 20px 0;color: var(--grey);"]],
                        innerHTML: strings.browserInfo
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.windowWidth + "\t" + window.innerWidth + "\t" + strings.windowHeight + "\t" + window.innerHeight
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.browserAgent + "<br>" + navigator.userAgent
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.cookieEnabled + ":\t" + (navigator.cookieEnabled ? strings.enabled : strings.disabled)
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.onLine + ":\t" + (navigator.onLine ? strings.cur_onLine : strings.cur_offLine)
                    }));
                });
            }
        }));
    } else if (type === 1) {
        // editor interface
        [...view.children].forEach((e) => {
            e.setAttribute("style", "transition:500ms;opacity:0;");
            setTimeout(() => {
                try {
                    view.removeChild(e);
                } catch (exception) {
                }
            }, 500);
        });

        view.appendChild(cE({
            type: "div",
            attr: [["id", "grid"], ["style", "background:url('./assets/mipmap/grid.png') repeat;width:5000px;height:5000px;z-index:0; background-size: 50px;"]]
        }));
        view.appendChild(cE({
            type: "div",
            attr: [["id", "drawable"]],
            innerHTML: "<svg id=\"resSvg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox='0 0 5000 5000'><defs><style>._bg-white{fill:#fff;}</style><symbol id='stationStyle_circle'><circle class=\"_bg-white\" cx=\"8\" cy=\"8\" r=\"8\"/><path class=\"_circleStroke\" d=\"M8,0C3.58,0,0,3.58,0,8s3.58,8,8,8s8-3.58,8-8S12.42,0,8,0z M8,14c-3.31,0-6-2.69-6-6c0-3.31,2.69-6,6-6s6,2.69,6,6C14,11.31,11.31,14,8,14z\"/></symbol><symbol id='stationStyle_rect'><path d='M0,0v16h16v-16z' class='_bg-white'/><path d='M0,0v16h16V0H0z M14,14H2V2h12V14z' class='_rectStroke'/></symbol></defs></svg>"
        }));
        view.appendChild(cE({type: "div", attr: [["id", "cursor"]]}));

        let helper_list_display = false;

        let toggle = cE({
            type: "div",
            attr: [["class", "toggle-Helper"]],
            innerHTML: "<div class='button'><span class='mi'>layers</span>" + strings.helper_toggle + "</div>",
            onclick: (e) => {
                if (!helper_list_display) {
                    helper_list_display = true;
                    let list = cE({type: "div", attr: [["class", "helper_list"]]});
                    [["open_in_new", strings.export, strings.exportAssets, strings.exportAssetsDescrption, () => {
                        exportDialog(pg.$("#resSvg")[0]);
                    }], ["settings", strings.settings, strings.openSettings, strings.openSettingsDescription, () => {
                        // prefDialog()
                    }], ["edit", strings.path, strings.path, strings.pathDescription, () => {
                        selectLineDialog();
                    }], ["home", strings.home, strings.home, strings.backHomeDescription, () => {
                        NotificationManager.create(strings.system, strings.fileSaved, 0, {
                            icon: "check",
                            icon_color: "var(--theme)"
                        });
                        initInterface(0);
                    }]].forEach((result) => {
                        let element = cE({
                            type: "div",
                            attr: [["class", "helper_list_item button"]],
                            innerHTML: "<span class='mi'>" + result[0] + "</span><span>" + result[1] + "</span>",
                            onclick: result[4]
                        });
                        list.appendChild(element);
                        HoverTips.create(element, result[2], result[3]);
                    });
                    document.body.appendChild(list);
                    e.stopPropagation();
                    window.addEventListener("click", () => {
                        try {
                            helper_list_display = false;
                            document.body.removeChild(pg.$(".helper_list")[0]);
                        } catch (e) {
                        }
                    }, {once: true});
                } else {
                    helper_list_display = false;
                    document.body.removeChild(pg.$(".helper_list")[0]);
                }
            }
        });

        HoverTips.create(toggle, strings.helper_more, strings.helper_moreDescription)

        view.appendChild(toggle);

        if (returnFunc)
            returnFunc();

        attachEvent.EditStation.attachClickEvent(pg.$("#drawable")[0]);
        attachEvent.EditStation.attachMoveEvent(pg.$("#drawable")[0], pg.$("#cursor")[0]);
    }


    ProgressManager.update(0, 0, 0);
    setTimeout(() => {
        ProgressManager.remove(0);
    }, 500);
}