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
        view.innerHTML = "";
        let storyboard = cE({type: "div", attr: [["class", "pg-storyboard"]]});
        view.appendChild(storyboard);
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
                            pathInfo = JSON.parse(reader.result);
                        } catch (e) {
                            NotificationManager.create(strings.system, strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + e, 0, {
                                time: -1,
                                icon: "close"
                            });
                            contentData = null;
                            initInterface(0);
                        }
                        if (Array.isArray(pathInfo)) {
                            for (let i = 0; i < pathInfo.length; i++) {
                                drawMap(i);
                            }
                            initInterface(1);
                        } else {
                            NotificationManager.create(strings.system, strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + strings.not_arr, 0, {
                                time: -1,
                                icon: "close"
                            });
                            contentData = null;
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
                initInterface(1, () => {
                    pathInfo = [{
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
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 225, "y": 775, "type": "destination", "routeToNext": ""}, {
                            "x": 225,
                            "y": 650,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 225, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 350,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 475, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 600,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 725, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 850,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 975, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 1100,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 1225, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 1325,
                            "y": 425,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 1225, "y": 325, "type": "destination", "routeToNext": ""}]
                    }];
                    contentData = "[{\"color\":\"#000\",\"id\":0,\"name\":\"UnnamedPath_0\",\"opacity\":1,\"stations\":[{\"x\":225,\"y\":1025,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":900,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":775,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":650,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":350,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":475,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":600,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":725,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":850,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":975,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1100,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1225,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1325,\"y\":425,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1225,\"y\":325,\"type\":\"destination\",\"routeToNext\":\"\"}]}]";
                    pathInfo.forEach(e => {
                        let svg = pg.$("#resSvg")[0];
                        let path = document.createElementNS(svg.namespaceURI, "path");
                        let stations = document.createElementNS(svg.namespaceURI, "g");
                        path.setAttributeNS(null, "stroke", "#000");
                        path.setAttributeNS(null, "id", "UnnamedPath_" + e.id);
                        path.setAttributeNS(null, "class", "pathElement");
                        stations.setAttributeNS(null, "id", "UnnamedStations_" + e.id);
                        svg.appendChild(path);
                        svg.appendChild(stations);
                        state.pathId++;
                    });
                    for (let i = 0; i < pathInfo.length; i++) {
                        drawMap(i);
                    }
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>open_in_new</span><span> " + strings.openNew + "</span>",
            onclick: () => {
                initInterface(1);
                pathInfo = [];
                contentData = "[]";
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
            view.appendChild(cE({
                type: "div",
                attr: [["id", "grid"], ["style", "background:url('./assets/mipmap/grid.png') repeat;width:5000px;height:5000px;z-index:0; background-size: 50px;"]]
            }));
            view.appendChild(cE({
                type: "div",
                attr: [["id", "drawable"]],
                innerHTML: "<svg id=\"resSvg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox='0 0 5000 5000'><defs><symbol id='stationStyle_circle'><path d='M0 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0z'/></symbol><symbol id='stationStyle_rect'><path d='M0,0v16h16V0H0z M14,14H2V2h12V14z'/></symbol></defs></svg>"
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
                        }], ["edit", strings.path, strings.path, strings.pathDescription, (event) => {
                            selectLineDialog();
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

            attachEvent.EditStation.attachClickEvent(pg.$("#drawable")[0]);
            attachEvent.EditStation.attachMoveEvent(pg.$("#drawable")[0], pg.$("#cursor")[0]);
            if (returnFunc)
                returnFunc();
        })
    }


    ProgressManager.update(0, 0, 0);
    setTimeout(() => {
        ProgressManager.remove(0);
    }, 500);
}